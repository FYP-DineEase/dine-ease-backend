import os
from transformers import pipeline

os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

model = "distilbert/distilbert-base-uncased-finetuned-sst-2-english"
revision = "af0f99b"

# Create the pipeline with the specified model
nlp = pipeline("sentiment-analysis", model=model, revision=revision)

def detect_sentiment(sentence):
    result = nlp(sentence)

    label = result[0]['label']
    score = result[0]['score']

    return {'label': label, 'score': score}

if __name__ == "__main__":
    sentence = 'Love this place with the vibrant colors on a Sunday morning after a night out! We loved the Bloody Mary bar, however they were out of almost everything and they didnt replace. Our waitress was not with it. We have 8 people and it was about a 2 hour trip, 30 min of that was her just trying to figure out the bills, credit cards and payments. It was bad.'
    analysis = detect_sentiment(sentence)
    print("Pipeline analysis")
    print(analysis)
