// This script relies on the pdf.js library being loaded from a CDN in index.html
declare const pdfjsLib: any;

export const parsePdfText = async (file: File): Promise<string> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file."));
      }
      
      try {
        const typedarray = new Uint8Array(event.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        resolve(fullText);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        reject(new Error("Could not parse the PDF file. It might be corrupted or in an unsupported format."));
      }
    };

    fileReader.onerror = (error) => {
      reject(new Error("Error reading file: " + error));
    };

    fileReader.readAsArrayBuffer(file);
  });
};

export const parsePdfFromUrl = async (url: string): Promise<string> => {
  try {
    // Step 1: Fetch the document
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Invalid URL or file not found. The server responded with an error (${response.status} ${response.statusText}).`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const typedarray = new Uint8Array(arrayBuffer);

    // Step 2: Parse the PDF
    try {
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      return fullText;
    } catch (parseError) {
      console.error("PDF Parsing Error from URL:", parseError);
      throw new Error("The linked file is not a valid or supported PDF document. Please check that the URL points directly to a PDF file.");
    }
  } catch (fetchError) {
    console.error("Error fetching PDF from URL:", fetchError);
    if (fetchError instanceof Error && (fetchError.message.includes("Invalid URL") || fetchError.message.includes("not a valid"))) {
        throw fetchError; // Re-throw our more specific errors from the inner logic
    }
    // This will catch general network errors (like no internet) and CORS issues.
    throw new Error("Could not download the document. This is likely due to a network issue or a server restriction (CORS). Please check the link and your internet connection.");
  }
};