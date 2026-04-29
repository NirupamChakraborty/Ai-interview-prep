const { PDFParse, VerbosityLevel } = require('pdf-parse');

module.exports = async function(buffer) {
    const parser = new PDFParse({ verbosity: VerbosityLevel.ERRORS });
    const text = await parser.getText(Buffer.from(buffer));
    return { text };
}