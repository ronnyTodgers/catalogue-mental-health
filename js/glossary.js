// Glossary terms handling
class GlossaryManager {
  constructor() {
    this.terms = {};
    this.initialized = false;
    this.sortedTerms = [];
    this.termVariations = new Map(); // Store term variations for fuzzy matching
    // Removed the flag, as .off().on() handles the singleton requirement
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Fetch glossary terms from our JSON file
      const response = await fetch("json/glossary.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch glossary: ${response.status}`);
      }
      this.terms = await response.json();

      // Process terms to create variations and sort by length
      this.sortedTerms = Object.entries(this.terms)
        .map(([termId, termData]) => {
          const variations = this.createTermVariations(termData.term);
          this.termVariations.set(termId, variations);
          return [termId, termData];
        })
        .sort((a, b) => b[1].term.length - a[1].term.length);

      console.log(
        "Sorted terms:",
        this.sortedTerms.map((t) => t[1].term)
      );

      // Process the page content
      this.processPageContent();

      // Initialize tooltips and attach the click handler ONCE using .off().on()
      this.initializeTooltips();

      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize glossary:", error);
    }
  }

  processPageContent() {
    // Process all content areas
    const contentAreas = document.querySelectorAll("#content");
    contentAreas.forEach((area) => {
      // First process direct text nodes
      this.processNode(area);

      // Then specifically target paragraphs and other text containers
      const textContainers = area.querySelectorAll(
        "p, li, td, th, div:not(.custom-control):not(.tooltip):not(.nav-link)"
      );
      textContainers.forEach((container) => {
        // Process each text container
        this.processNode(container);
      });
    });

    // Process filter labels separately
    this.processFilterLabels();
  }

  processFilterLabels() {
    // Process all filter labels
    const labels = document.querySelectorAll(".custom-control-label");
    console.log("Processing filter labels:", labels.length);

    labels.forEach((label) => {
      // Skip if already processed
      if (label.querySelector(".glossary-term")) return;

      // Process the entire label content
      const text = label.textContent;
      if (text) {
        let newHtml = text;
        let hasMatches = false;
        let replacements = [];

        // First pass: collect all matches
        this.sortedTerms.forEach(([termId, termData]) => {
          const pattern = this.createMatchPattern(termId);
          if (!pattern) return;

          const regex = new RegExp(pattern, "gi");
          let match;
          while ((match = regex.exec(text)) !== null) {
            replacements.push({
              start: match.index,
              end: match.index + match[0].length,
              term: match[0],
              termId: termId,
            });
          }
        });

        // Sort replacements by position and filter overlapping matches
        replacements.sort((a, b) => a.start - b.start);
        replacements = replacements.filter((rep, i) => {
          if (i === 0) return true;
          const prev = replacements[i - 1];
          return rep.start >= prev.end;
        });

        // Second pass: apply replacements in reverse order
        replacements.reverse().forEach((rep) => {
          hasMatches = true;
          const before = newHtml.substring(0, rep.start);
          const after = newHtml.substring(rep.end);
          newHtml =
            before +
            `<span class="glossary-term" data-term-id="${rep.termId}" data-toggle="tooltip">${rep.term}</span>` +
            after;
        });

        if (hasMatches) {
          label.innerHTML = newHtml;
        }
      }
    });
  }

  processNode(node) {
    // Skip script and style tags
    if (node.nodeName === "SCRIPT" || node.nodeName === "STYLE") return;

    // Skip if inside the main navbar
    if (node.parentElement && node.parentElement.closest(".navbar")) {
      return;
    }

    // Skip if this node or its parent is already a glossary term
    if (
      (node.classList && node.classList.contains("glossary-term")) ||
      (node.parentElement &&
        node.parentElement.classList &&
        node.parentElement.classList.contains("glossary-term"))
    ) {
      return;
    }

    // Process text nodes
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      let text = node.textContent;
      let newHtml = text;
      let hasMatches = false;
      let replacements = [];

      // First pass: collect all matches
      this.sortedTerms.forEach(([termId, termData]) => {
        const pattern = this.createMatchPattern(termId);
        if (!pattern) return;

        const regex = new RegExp(pattern, "gi");
        let match;
        while ((match = regex.exec(text)) !== null) {
          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            term: match[0],
            termId: termId,
          });
        }
      });

      // Sort replacements by position and filter overlapping matches
      replacements.sort((a, b) => a.start - b.start);
      replacements = replacements.filter((rep, i) => {
        if (i === 0) return true;
        const prev = replacements[i - 1];
        return rep.start >= prev.end;
      });

      // Second pass: apply replacements in reverse order
      replacements.reverse().forEach((rep) => {
        hasMatches = true;
        const before = newHtml.substring(0, rep.start);
        const after = newHtml.substring(rep.end);
        newHtml =
          before +
          `<span class="glossary-term" data-term-id="${rep.termId}" data-toggle="tooltip">${rep.term}</span>` +
          after;
      });

      // Only replace if we found matches
      if (hasMatches) {
        const wrapper = document.createElement("span");
        wrapper.innerHTML = newHtml;
        node.parentNode.replaceChild(wrapper, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Skip form elements and tooltips
      const skipTags = [
        "SCRIPT",
        "STYLE",
        "INPUT",
        "TEXTAREA",
        "SELECT",
        "BUTTON",
      ];
      if (!skipTags.includes(node.nodeName) && !node.closest(".tooltip")) {
        // Recursively process child nodes
        Array.from(node.childNodes).forEach((child) => this.processNode(child));
      }
    }
  }

  createTermVariations(term) {
    const variations = new Set();

    // Add original term
    variations.add(term);

    // Add hyphenated and non-hyphenated variations
    if (term.includes("-")) {
      variations.add(term.replace(/-/g, " "));
    } else if (term.includes(" ")) {
      variations.add(term.replace(/\s+/g, "-"));
    }

    // Extract and add abbreviation if present
    const abbreviationMatch = term.match(/\(([^)]+)\)$/);
    if (abbreviationMatch) {
      const abbreviation = abbreviationMatch[1];
      variations.add(abbreviation);
    }

    return variations;
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  createMatchPattern(termId) {
    const variations = this.termVariations.get(termId);
    if (!variations) return "";

    const patterns = [];

    variations.forEach((variation) => {
      if (/^[A-Z]+$/.test(variation)) {
        // For abbreviations, ensure proper boundaries
        patterns.push(
          `(?<=^|\\s|\\()(${this.escapeRegExp(variation)})(?=$|\\s|\\))`
        );
      } else {
        // For regular terms, use word boundaries
        patterns.push(`\\b${this.escapeRegExp(variation)}\\b`);
      }
    });

    return patterns.join("|");
  }

  initializeTooltips() {
    // Find all elements with glossary-term class
    const glossaryTerms = document.querySelectorAll(".glossary-term");
    console.log("Initializing tooltips for", glossaryTerms.length, "terms");

    // Initialize Bootstrap tooltips with custom configuration
    glossaryTerms.forEach((term) => {
      const termId = term.getAttribute("data-term-id");
      const definition =
        (this.terms[termId] && this.terms[termId].definition) ||
        "Definition not found";

      // Remove any existing tooltip
      $(term).tooltip("dispose");

      // --- Filter out internal anchor links ---
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = definition;
      tempDiv.querySelectorAll('a[href^="#"]').forEach((a) => {
        // Replace the anchor tag with its text content
        a.outerHTML = a.textContent;
      });
      const cleanedDefinition = tempDiv.innerHTML;
      // --- End filtering ---

      // --- More/Less Logic ---
      const maxLength = 400; // Target plain text length
      // Get plain text for length check
      tempDiv.innerHTML = cleanedDefinition; // Use cleaned definition
      const plainTextDefinition =
        tempDiv.textContent || tempDiv.innerText || "";
      let showReadMore = plainTextDefinition.length > maxLength;

      // Create unique ID for this tooltip
      const tooltipId = `tooltip-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      // Check if definition is too long and truncate if necessary
      if (definition.length > maxLength) {
        // Find the end of a sentence or paragraph near maxLength
        let cutoff = definition.substring(0, maxLength).lastIndexOf(". ");
        if (cutoff === -1)
          cutoff = definition.substring(0, maxLength).lastIndexOf(".");
        if (cutoff === -1)
          cutoff = definition.substring(0, maxLength).lastIndexOf("\n");
        if (cutoff === -1) cutoff = maxLength;

        // Truncate the definition
        // No JS truncation needed now, CSS will handle it
      }

      // Use the cleaned HTML definition for both short and full views initially
      const formattedShortDef = cleanedDefinition;
      const formattedFullDef = cleanedDefinition; // Use full def here too

      // Create tooltip content with expandable section
      // Add 'expandable' class if showReadMore is true
      const tooltipContent = `
        <div class="tooltip-content ${showReadMore ? "expandable" : ""}">
          <div class="definition-content initial-view">
            ${formattedFullDef} 
          </div>
          ${
            // Only add the 'More...' link if needed
            showReadMore
              ? `
            <div class="read-more-link">
              <a href="#" class="toggle-definition" data-tooltip-id="${tooltipId}" data-state="short">More...</a>
            </div>
          `
              : ""
          }
          <div class="datamind-logo">
            <span style="display: block; color: #eee;">Definition from</span>
            <a href="https://datamind.org.uk/glossary" target="_blank">
              <img src="img/DATAMIND.png" alt="DATAMIND" style="width: 130%; height: auto;">
            </a>
          </div>
        </div>
      `;

      // Initialize new tooltip with delay
      $(term).tooltip({
        template:
          '<div class="tooltip glossary-tooltip" role="tooltip">' +
          '<div class="arrow"></div>' +
          '<div class="tooltip-inner"></div>' +
          "</div>",
        title: tooltipContent,
        html: true,
        placement: "auto",
        trigger: "manual",
        container: "body",
        boundary: "window",
      });

      // Custom event handling for hover behavior
      let hideTimeout;
      let showTimeout;
      const showDelay = 200;
      const hideDelay = 300;

      // Keep track of current active tooltip
      let currentTooltip = null;

      // Show tooltip on mouseenter
      $(term).on("mouseenter", function () {
        // Clear any pending show operations
        clearTimeout(showTimeout);
        clearTimeout(hideTimeout);

        // Hide any existing tooltip immediately
        if (currentTooltip && currentTooltip !== this) {
          $(currentTooltip).tooltip("hide");
          currentTooltip = null;
        }

        const self = this;
        showTimeout = setTimeout(() => {
          // Only show if we're still the pending tooltip
          if (currentTooltip === self) {
            $(self).tooltip("show");
          }
        }, showDelay);

        currentTooltip = this;
      });

      // Hide tooltip on mouseleave (with delay)
      $(term).on("mouseleave", function () {
        clearTimeout(showTimeout);

        const self = this;
        const $tooltip = $(
          `.tooltip[id="${$(this).attr("aria-describedby")}"]`
        );

        hideTimeout = setTimeout(() => {
          // Only hide if mouse isn't over tooltip
          if (!$tooltip.is(":hover")) {
            $(self).tooltip("hide");
            if (currentTooltip === self) {
              currentTooltip = null;
            }
          }
        }, hideDelay);
      });

      // Handle tooltip hover
      $(document).on("mouseenter", ".tooltip.glossary-tooltip", function () {
        if (currentTooltip) {
          clearTimeout(hideTimeout);
          clearTimeout(showTimeout);
        }
      });

      $(document).on("mouseleave", ".tooltip.glossary-tooltip", function () {
        clearTimeout(showTimeout);

        const termId = $(this).attr("id");
        const $term = $(`[aria-describedby="${termId}"]`);
        hideTimeout = setTimeout(() => {
          $term.tooltip("hide");
          if (currentTooltip === $term[0]) {
            currentTooltip = null;
          }
        }, hideDelay);
      });
    }); // End of glossaryTerms.forEach

    // Attach the click handler ONCE to the document using .off().on()
    $(document)
      .off("click.toggleDefinition") // Remove any previous handlers namespaced to toggleDefinition
      .on("click.toggleDefinition", ".toggle-definition", function (e) {
        // Attach with namespace
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling

        const link = $(this);
        // Wrap the core logic in a setTimeout to defer execution slightly
        setTimeout(() => {
          // Use .attr() to reliably read the data attribute directly from the clicked link
          const tooltipId = link.attr("data-tooltip-id"); // Keep this for potential debugging if needed

          // Find the parent tooltip-content div relative to the clicked link
          const tooltipContent = link.closest(".tooltip-content");

          if (tooltipContent.length === 0) {
            console.error("Could not find parent .tooltip-content for link.");
            return; // Exit if element not found
          }

          // Toggle the 'expanded' class on the tooltip content container
          const isExpanding = !tooltipContent.hasClass("expanded");
          tooltipContent.toggleClass("expanded", isExpanding);

          // Update link text and state based on the new state
          if (isExpanding) {
            link.text("Less...");
            link.attr("data-state", "full");
          } else {
            link.text("More...");
            link.attr("data-state", "short");
          }

          // Force tooltip to recalculate its position
          const tooltipElement = tooltipContent.closest(".tooltip");
          if (!tooltipElement.length) {
            console.error("Could not find parent .tooltip element.");
            return;
          }
          const tooltipElementId = tooltipElement.attr("id");
          // Find the original term element that the tooltip is attached to
          const termElement = $(`[aria-describedby="${tooltipElementId}"]`);

          if (termElement.length) {
            const tooltipInstance = termElement.data("bs.tooltip");
            if (
              tooltipInstance &&
              tooltipInstance.tip &&
              $(tooltipInstance.tip).hasClass("show")
            ) {
              // No need for another setTimeout here, the outer one handles the delay
              // tooltipInstance.update(); // Commented out to prevent immediate collapse issue
            }
          } else {
            console.warn(
              "Could not find term element for tooltip update using ID:",
              tooltipElementId
            );
          }
        }, 50); // Use a 50ms delay
      });
  } // End of initializeTooltips
}

// Initialize glossary manager
const initGlossary = () => {
  console.log("Initializing glossary...");
  const glossaryManager = new GlossaryManager();
  glossaryManager.initialize();
};

// For search page: override createFilters
if (typeof createFilters !== "undefined") {
  const originalCreateFilters = window.createFilters;
  window.createFilters = function () {
    originalCreateFilters.apply(this, arguments);
    initGlossary();
  };
}

// Initialize on DOM ready for all pages
$(document).ready(() => {
  // Ensure Bootstrap tooltip plugin is available
  if (typeof $.fn.tooltip === "undefined") {
    console.error("Bootstrap tooltip plugin is not loaded!");
    return;
  }

  // Initialize glossary
  initGlossary();
});
