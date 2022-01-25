def if_present_or_else(x, func, default):
    if x is None:
        return default
    else:
        return func()


def if_valid_key_or_else(obj, key, func, default):
    if key in obj:
        return func()
    else:
        return default


def convert_decimal_values_to_int(obj):
    if obj.get('budget', None):
        obj['budget']['min'] = int(obj['budget']['min'])
        obj['budget']['max'] = int(obj['budget']['max'])

    if obj.get('reviews', None):
        obj['reviews'] = list(map(__convert_review_decimal_rating_to_int, obj.get('reviews')))

    return obj


def __convert_review_decimal_rating_to_int(review):
    if review.get('score', None):
        review['score'] = int(review['score'])
    if review.get('rating', None):
        review['rating'] = int(review['rating'])
    return review
