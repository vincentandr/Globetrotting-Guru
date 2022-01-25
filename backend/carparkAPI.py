from datetime import datetime
from external_APIs import get_carpark_data

class carparkAPI:
    def __init__(self):
        self.latest_carpark_API_fetch = datetime.utcnow()

        self.carpark_data = {}

    def get_lots_available(self, dynamodb, carpark_id):
        if carpark_id is None or carpark_id == '':
            return None

        now = datetime.utcnow()

        difference = (now - self.latest_carpark_API_fetch).total_seconds()

        # fetch new lots data only every 5 mins
        if difference < 300 and len(self.carpark_data) > 0:
            return self.carpark_data[carpark_id]

        response = get_carpark_data()

        places_table = dynamodb.Table('places')

        items = places_table.scan()['Items']

        # only keep the carpark data according to what places use them in the db
        self.carpark_data = dict(map(lambda i: (i['CarParkID'], i['AvailableLots']),
                                  filter(lambda i: i['CarParkID'] in
                                                   [item['carpark_id'] for item in items if item.get('carpark_id', None)
                                                    is not None], response)))

        self.latest_carpark_API_fetch = now

        return self.carpark_data[carpark_id]