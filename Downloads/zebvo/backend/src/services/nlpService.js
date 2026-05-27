import Sentiment from 'sentiment';
import natural from 'natural';

const sentiment = new Sentiment();
const { BayesClassifier } = natural;

export class NLPService {
  constructor() {
    // Initialize category classifier
    this.categoryClassifier = new BayesClassifier();
    this.initializeClassifier();
  }

  initializeClassifier() {
    // Training data for category classification
    const trainingData = [
      // Application category
      { text: 'new passport application process', category: 'Application' },
      { text: 'apply for passport online', category: 'Application' },
      { text: 'passport application requirements', category: 'Application' },
      { text: 'how to apply for passport', category: 'Application' },

      // Renewal category
      { text: 'passport renewal procedure', category: 'Renewal' },
      { text: 'renew passport expiring soon', category: 'Renewal' },
      { text: 'passport renewal form', category: 'Renewal' },

      // Appointments
      { text: 'book appointment for passport', category: 'Appointments' },
      { text: 'passport office appointment', category: 'Appointments' },
      { text: 'available slots for passport', category: 'Appointments' },

      // Tatkal
      { text: 'tatkal passport service', category: 'Tatkal' },
      { text: 'urgent passport tatkal', category: 'Tatkal' },
      { text: 'express passport service', category: 'Tatkal' },

      // Visa category
      { text: 'passport and visa requirements', category: 'Visa' },
      { text: 'visa processing for passport', category: 'Visa' },
      { text: 'passport for visa application', category: 'Visa' },

      // Travel Issues
      { text: 'passport lost while traveling', category: 'Travel Issues' },
      { text: 'passport emergency abroad', category: 'Travel Issues' },
      { text: 'travel document issues', category: 'Travel Issues' },

      // Government Announcements
      { text: 'passport office announcement', category: 'Government Announcements' },
      { text: 'government passport initiative', category: 'Government Announcements' },
      { text: 'ministry of external affairs', category: 'Government Announcements' },

      // Scams/Fraud
      { text: 'passport scam warning', category: 'Scams/Fraud' },
      { text: 'fake passport fraud', category: 'Scams/Fraud' },
      { text: 'passport forgery alert', category: 'Scams/Fraud' },
      { text: 'be careful of passport fraud', category: 'Scams/Fraud' },

      // News
      { text: 'passport policy changes', category: 'News' },
      { text: 'news about passport', category: 'News' },
      { text: 'passport news update', category: 'News' },

      // Personal Experiences
      { text: 'my passport experience', category: 'Personal Experiences' },
      { text: 'share your passport story', category: 'Personal Experiences' },
      { text: 'passport journey', category: 'Personal Experiences' },
    ];

    trainingData.forEach(({ text, category }) => {
      this.categoryClassifier.addDocument(text.toLowerCase(), category);
    });

    this.categoryClassifier.train();
  }

  /**
   * Classify a post into a category using Naive Bayes
   */
  categorizePost(text) {
    try {
      const classification = this.categoryClassifier.classify(text.toLowerCase());
      return classification || 'Other';
    } catch (error) {
      console.error('Categorization error:', error);
      return 'Other';
    }
  }

  /**
   * Generate a short summary (30 words) using word frequency
   */
  generateSummary(text) {
    try {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      const firstSentence = sentences[0].trim();
      const words = firstSentence.split(/\s+/);
      const summary = words.slice(0, 30).join(' ');
      return summary.length > 0 ? summary : text.substring(0, 160);
    } catch (error) {
      console.error('Summary generation error:', error);
      return text.substring(0, 160);
    }
  }

  /**
   * Detect sentiment of a post
   */
  analyzeSentiment(text) {
    try {
      const result = sentiment.analyze(text);
      let sentimentLabel = 'neutral';
      let score = result.score;

      if (result.score > 0) sentimentLabel = 'positive';
      else if (result.score < 0) sentimentLabel = 'negative';

      return {
        sentiment: sentimentLabel,
        score: score,
        comparative: result.comparative,
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return {
        sentiment: 'neutral',
        score: 0,
        comparative: 0,
      };
    }
  }

  /**
   * Detect gibberish/spam content
   * Returns score from 0-1 (higher = more gibberish)
   */
  detectGibberish(text) {
    try {
      let gibberishScore = 0;

      // Check 1: Excessive special characters
      const specialCharRatio = (text.match(/[^a-zA-Z0-9\s]/g) || []).length / text.length;
      if (specialCharRatio > 0.3) gibberishScore += 0.3;

      // Check 2: Excessive numbers
      const numberRatio = (text.match(/\d/g) || []).length / text.length;
      if (numberRatio > 0.4) gibberishScore += 0.2;

      // Check 3: Repeating characters
      const repeatingPattern = /(.)\1{4,}/.test(text);
      if (repeatingPattern) gibberishScore += 0.2;

      // Check 4: URL spam
      const urlCount = (text.match(/https?:\/\/[^\s]+/gi) || []).length;
      if (urlCount > 3) gibberishScore += 0.2;

      // Check 5: Hashtag spam
      const hashtagCount = (text.match(/#[a-zA-Z0-9_]+/g) || []).length;
      if (hashtagCount > 10) gibberishScore += 0.15;

      // Normalize score to 0-1
      const finalScore = Math.min(gibberishScore, 1);
      const isGibberish = finalScore > 0.6;

      return {
        score: finalScore,
        isGibberish: isGibberish,
      };
    } catch (error) {
      console.error('Gibberish detection error:', error);
      return {
        score: 0,
        isGibberish: false,
      };
    }
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text) {
    try {
      const tokens = text.toLowerCase().split(/\s+/);
      const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'from',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'it', 'its', 'this',
        'that', 'of', 'for', 'with', 'by', 'as', 'i', 'you', 'he', 'she', 'we',
      ]);

      const keywords = tokens
        .filter(token => !stopWords.has(token) && token.length > 3)
        .slice(0, 10);

      return [...new Set(keywords)];
    } catch (error) {
      console.error('Keyword extraction error:', error);
      return [];
    }
  }
}

export default new NLPService();
