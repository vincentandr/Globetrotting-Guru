from cache import get_generated_recommendations
from utils import if_present_or_else, convert_decimal_values_to_int


def get_top_recommendation(user_id, items, user_interests, user_places, user_budget):
    existing_generated_recommendations = if_present_or_else(user_id,
                                                            lambda: get_generated_recommendations(user_id),
                                                            [])
    return next(map(convert_decimal_values_to_int,
                    filter(lambda i: i not in existing_generated_recommendations,
                           sorted(items,
                                  key=lambda i: __get_recommendation_score(i, user_interests, user_places, user_budget),
                                  reverse=True))),
                None)


# We assign a score to each recommendation and return the top result
def __get_recommendation_score(item, user_interests=[], user_places={}, user_budget={}):
    score = 0

    # Assign +1 if a recommendation has a tag matching user interest
    if user_interests:
        score += sum(map(lambda i: any(t == i for t in item['tags']), user_interests))

    # Assign +2 if a recommendation is a liked place, -2 if a recommendation is a disliked place lul
    if user_places:
        if any(i == item['place_id'] for i in user_places['likes']):
            score += 2
        if any(i == item['place_id'] for i in user_places['dislikes']):
            score -= 2

    # Assign +1 if place is within budget, else -1
    if user_budget:
        if __is_within_budget(item, user_budget['min'], user_budget['max']):
            score += 1
        else:
            score -= 1

    return score


def __is_within_budget(item, min_budget, max_budget):
    if item.get('budget', None):
        return item['budget']['min'] <= min_budget <= item['budget']['max'] or \
               item['budget']['min'] <= max_budget <= item['budget']['max']
    return True
