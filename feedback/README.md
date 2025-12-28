# Encrypted Feedback Storage

This directory contains encrypted user feedback collected from the Friendship Health Checkup application.

## How It Works

1. **User Feedback**: Users complete the assessment and optionally provide feedback through the FeedbackWidget
2. **Encryption**: Feedback is encrypted using AES-256-GCM encryption before export
3. **Export**: Users can export their encrypted feedback as JSON files
4. **Submission**: Users submit feedback by creating a GitHub issue and attaching the encrypted file
5. **Storage**: Maintainers review and store encrypted feedback files in this directory

## Privacy & Security

- **Encryption**: All feedback is encrypted using AES-256-GCM
- **Anonymous**: Only aggregated, anonymous data is collected:
  - Overall assessment score
  - Category (Thriving, Healthy, Moderate, etc.)
  - User rating (1-5 stars)
  - Accuracy rating (Very Accurate, Somewhat, Not Accurate)
  - Helpfulness (Yes, Neutral, No)
  - Optional comments
  - Language preference
  - Timestamp

- **No Personal Information**: The following are NOT included:
  - Friend's name
  - Individual question answers
  - IP addresses
  - User identifiers
  - Any personally identifiable information

## Decryption

To decrypt feedback for analysis (maintainers only):

```javascript
import { decryptFeedback } from '../src/utils/encryption.js';

// Read encrypted feedback file
const encryptedData = JSON.parse(fs.readFileSync('feedback/feedback_encrypted_*.json'));

// Decrypt each entry
for (const entry of encryptedData) {
  const decrypted = await decryptFeedback(entry.data);
  console.log(decrypted);
}
```

## File Naming Convention

Encrypted feedback files follow this pattern:
```
feedback_encrypted_{timestamp}.json
```

Example: `feedback_encrypted_1703876543210.json`

## Data Structure

Each encrypted feedback file contains an array of encrypted entries:

```json
[
  {
    "id": 1703876543210,
    "timestamp": "2024-12-28T20:00:00.000Z",
    "data": "base64_encrypted_data_here"
  }
]
```

When decrypted, each entry contains:

```json
{
  "id": 1703876543210,
  "timestamp": "2024-12-28T20:00:00.000Z",
  "overallScore": 85,
  "category": "Thriving Friendship",
  "rating": 5,
  "accuracy": "very_accurate",
  "helpful": "yes",
  "comments": "Great tool for self-reflection!",
  "language": "english"
}
```

## Contributing Feedback

If you want to contribute feedback from users:

1. Users export their encrypted feedback from the app
2. Create a GitHub issue titled "Feedback Submission [DATE]"
3. Attach the encrypted JSON file
4. Maintainers will review and add approved feedback to this directory

## Analysis

Aggregated feedback analysis will help improve:
- Question clarity
- Assessment accuracy
- User experience
- Feature development
- Language support

Thank you for contributing to making Friendship Health Checkup better!
