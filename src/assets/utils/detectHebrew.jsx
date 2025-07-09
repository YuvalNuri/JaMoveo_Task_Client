export default function detectHebrew(text) {
    return /[\u0590-\u05FF]/.test(text);
}