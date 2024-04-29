import sys
import json
import pandas as pd
from pandas import json_normalize
from geopy.distance import geodesic
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer

# Create restaurants dataframe
restaurants_json = sys.stdin.read()
restaurants = json.loads(restaurants_json)
restaurantsDf = json_normalize(restaurants)
restaurantsDf = restaurantsDf.reset_index(drop=True)

# Retrive user reviewd restaurants
restaurantIds = sys.argv[1].split(", ")

# Restaurant ids as indices
indices = pd.Series(restaurantsDf.index, index=restaurantsDf['_id'])

# Create a TF-IDF vectorizer to convert cuisines into numerical data
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(restaurantsDf["categories"].astype(str))

# Compute the cosine similarity between cuisines
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
cosine_sim.shape

def get_recommendations(similarity_threshold, restaurant_rating_threshold):
    
    # Recommendations Dataframe
    recommendations = pd.DataFrame()
    
    # Loop through restaurants in the DataFrame
    for id in restaurantIds:

        # Get restaurant indices based on name
        idx = indices[id]
        
        # Get the cosine similarity scores for the cuisine
        sim_scores = list(enumerate(cosine_sim[idx]))

        # Sort the restaurants based on similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Threshold of similarity
        sim_threshold_scores = [x[0] for x in sim_scores if x[1] >= similarity_threshold]
    
        # Get the restaurant indices with high similarity and rating greater than 3
        restaurant_indices = [i for i in sim_threshold_scores if (
            restaurantsDf.at[i, 'rating'] >= restaurant_rating_threshold and
            restaurantsDf.at[i, '_id'] != id
        )]

        # Add the recommendations to the DataFrame
        recommendations = pd.concat([recommendations, restaurantsDf.iloc[restaurant_indices]])
        
    recommendations = recommendations.drop_duplicates(subset='_id').reset_index(drop=True)
    return recommendations


if __name__ == "__main__":
    user_coordinates = tuple(map(float, sys.argv[2].split(", ")))
        
    # Get recommended restaurants
    recommendations = get_recommendations(0.85, 3.0)
    
    # Calculate distance for each restaurant
    recommendations["distance"] = recommendations.apply(
        lambda row: geodesic(user_coordinates, (row['location.coordinates'][1], row['location.coordinates'][0])).kilometers,
        axis=1
    )
    
    recommendations = recommendations.sort_values(by="distance")
    
    print(recommendations.to_json(orient='records'))