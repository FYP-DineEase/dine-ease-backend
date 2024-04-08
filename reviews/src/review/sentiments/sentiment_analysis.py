import sys
import json
from nltk.sentiment.vader import SentimentIntensityAnalyzer

sid = SentimentIntensityAnalyzer()

def sentiment_analysis(sentence):
    scores = sid.polarity_scores(sentence)

    if scores['compound'] >= 0.5:
        label = 'positive'
    elif scores['compound'] <= -0.5:
        label = 'negative'
    else:
        label = 'neutral'
    
    return json.dumps({'label': label, 'score': scores['compound']})

if __name__ == "__main__":
    sentence = sys.argv[1]
    analysis = sentiment_analysis(sentence)
    print(analysis)
