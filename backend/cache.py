from main import cache


# Returns a set of recommendations that have already been presented to user in current session
def get_generated_recommendations(user_id):
    return get_recommendations_for_user(user_id)


def update_generated_recommendations(user_id, place_id):
    generated_recommendations = get_recommendations_for_user(user_id)
    cache.set(user_id, generated_recommendations + [place_id])


def get_recommendations_for_user(user_id):
    generated_recommendations = cache.get(user_id)
    if generated_recommendations is None:
        return []
    else:
        return generated_recommendations
