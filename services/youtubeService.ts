// A disclaimer about the experimental nature of this feature is highly recommended in the UI.
// This service relies on a third-party, unofficial API.

const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

const extractVideoId = (url: string): string | null => {
  const match = url.match(YOUTUBE_ID_REGEX);
  return match ? match[1] : null;
};

interface TranscriptLine {
  text: string;
}

export const fetchTranscript = async (youtubeUrl: string): Promise<string> => {
  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
    throw new Error("Invalid YouTube URL. Please make sure you are using a valid YouTube video link.");
  }

  try {
    // Using a public, unofficial API proxy for youtube transcripts.
    // This may be unstable or have limitations.
    const response = await fetch(`https://youtubetranscript.com/?server_vid=${videoId}`);
    if (!response.ok) {
        throw new Error(`The transcript service is currently unavailable or the video is inaccessible. Please try again later.`);
    }
    const transcriptData: TranscriptLine[] = await response.json();
    
    if (!transcriptData || transcriptData.length === 0) {
        throw new Error("Could not fetch transcript for this video. It may not have English captions available, or they might be disabled by the creator.");
    }
    
    return transcriptData.map(line => line.text).join(' ');
  } catch (error) {
    console.error("YouTube Transcript Fetch Error:", error);
    if (error instanceof Error && (error.message.includes("Could not fetch transcript") || error.message.includes("transcript service") || error.message.includes("Invalid YouTube URL"))) {
        throw error; // Re-throw our specific error to avoid being caught by the generic one below.
    }
    throw new Error("An unexpected error occurred while fetching the transcript. This is an experimental feature and may not work for all videos.");
  }
};