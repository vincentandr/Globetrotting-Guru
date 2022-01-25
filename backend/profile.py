from utils import if_valid_key_or_else, convert_decimal_values_to_int


def get_user_profile(user_id, user_table):
    query = user_table.get_item(Key={'user_id': user_id})

    return if_valid_key_or_else(query, "Item", lambda: convert_decimal_values_to_int(query['Item']), {})