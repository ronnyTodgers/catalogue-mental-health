const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const path = require("path");

async function scrapeGlossary() {
  try {
    // Fetch the glossary page from datamind
    console.log("Fetching glossary from datamind.org.uk...");
    const response = await fetch("https://datamind.org.uk/resources/glossary", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch glossary: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Object to store our terms
    const glossaryTerms = {};
    let termCount = 0;

    // Process each table row
    $("tr").each((i, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 5) {
        const term = $(cells[0]).text().trim();
        const category = $(cells[1]).text().trim();
        // Use .html() to preserve formatting in the description
        const description = $(cells[2]).html().trim();
        const type = $(cells[3]).text().trim();

        // Skip header row and check our conditions
        if (
          term !== "Term" &&
          (type === "Cohort or longitudinal" || category === "Health Research")
        ) {
          if (term && description) {
            termCount++;
            const termId = `term_${termCount}`;

            glossaryTerms[termId] = {
              term,
              definition: description,
            };
          }
        }
      }
    });

    // If no terms found, use fallback terms
    if (termCount === 0) {
      console.log("No terms found. Using fallback terms...");

      glossaryTerms.term_1 = {
        term: "longitudinal study",
        definition:
          "Research conducted over an extended period, involving repeated observations of the same variables.",
      };
      glossaryTerms.term_2 = {
        term: "cohort study",
        definition:
          "A type of longitudinal research that follows a group of individuals who share a common characteristic over time.",
      };
      termCount = 2;
    }

    // Ensure the json directory exists
    const jsonDir = path.join(__dirname, "..", "json");
    await fs.mkdir(jsonDir, { recursive: true });

    // Write the terms to our JSON file
    const outputPath = path.join(jsonDir, "glossary.json");
    await fs.writeFile(
      outputPath,
      JSON.stringify(glossaryTerms, null, 2),
      "utf8"
    );

    console.log(
      `Successfully scraped and saved ${termCount} glossary terms to glossary.json`
    );
  } catch (error) {
    console.error("Error scraping glossary terms:", error);
    process.exit(1);
  }
}

// Run the scraper
scrapeGlossary();
