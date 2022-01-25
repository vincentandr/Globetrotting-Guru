// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

const FAKE_DELAY_MS = 1000;

const buildDummyUser = (user) => {
  return {
    ...user,
    budget: {
      min: 10,
      max: 100,
    },
    interests: ['food', 'outdoors'],
    places: {
      likes: [
        'Marina Bay Sands',
        'ArtScience Museum',
        'Universal Studios Singapore',
        'National Museum',
      ],
      dislikes: ['Gardens By The Bay'],
    },
  };
};

const dummyProfileValues = {
  interests: [
    'food',
    'museums',
    'landmarks',
    'traditional',
    'art',
    'science',
    'technology',
    'shopping',
    'theme parks',
    'nature',
    'outdoors',
  ],
  places: [
    'ArtScience Museum',
    'National Museum',
    'Lau Pa Sat',
    'Gardens By The Bay',
    'Marina Bay Sands',
    'Ion Orchard',
    'Chinatown',
    'Little India',
    'Singapore Art Museum',
    'Universal Studios Singapore',
    'Macritchie Reservoir',
  ],
};

const dummyRecommendations = [
  {
    name: 'Macritchie Reservoir',
    description:
      'MacRitchie Reservoir is Singapore\'s oldest reservoir. The reservoir was completed in 1868 by impounding water from an earth embankment, and was then known as the Impounding Reservoir or Thomson Reservoir.',
    reviews: [
      {
        text:
          'Trail run and walks toward the treetop, tend to be busy on the weekends.',
        score: 4,
      },
      {
        text:
          'It\'s a great place to come for a long walk and experience the nature. The only downside is the incomprehensible and unhelpful directory. Took us several detours at the to find the exit',
        score: 2,
      },
    ],
    traffic: 'Not Crowded',
    weather: 'Windy',
    budget: [0,5],
    images: [
      'https://mywowo.net/media/images/cache/singapore_macritchie_reservoir_01_introduzione_jpg_1200_630_cover_85.jpg',
      'https://images.prismic.io/99-content/ea164bba-c625-42c8-a913-60befb6dc2cf_macritchie-reservoir-park-singapore-3.png',
      'https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/02/7f/f0/macritchie-reservoir.jpg'
    ],
  },
  {
    name: 'Universal Studios Singapore',
    description:
      'Universal Studios Singapore is a theme park located within Resorts World Sentosa on Sentosa Island, Singapore. It features 28 rides, shows, and attractions in seven themed zones.',
    reviews: [
      {
        text:
          'Universal Studios Singapore is a theme park located within Resorts World Sentosa on Sentosa Island, Singapore. It features 28 rides, shows, and attractions in seven themed zones.',
        score: 4,
      },
      {
        text:
          'It was fun but the queue is too long, it is nice to try once. Merchandise is a bit pricey but I think that is normal. Love the Jurassic park',
        score: 4,
      },
    ],
    traffic: 'Very Crowded',
    weather: 'Very Sunny',
    budget: [55,200],
    images: [
      'https://dwgfmnrdprofc.cloudfront.net/wp-content/uploads/2020/03/universal-studios-singapore-6.jpg',
      'https://media.timeout.com/images/105632351/image.jpg',
      'https://preparetravelplans.com/wp-content/uploads/2020/07/Best-USS-Rides-and-Attractions.jpg'
    ],
  },
  {
    name: 'Little India',
    description:
      'A buzzing ethnic district. Little India is a buzzing historic area that shows off the best of Singapore\'s Indian community, from vibrant culture to incredible shopping.',
    reviews: [
      {
        text:
          'Bright and beautiful ,Little India was bright vibrant and had great variety of shops and indian restaurants. Great indian food if you are a fan The markets were good little crowded',
        score: 5,
      },
      {
        text:
          'A nice place to walk around and try some Indian delicacies. There are several restaurants serving all kinds of cuisine from India.',
        score: 3,
      },
    ],
    traffic: 'Very Crowded',
    weather: 'Sunny',
    budget: [1,40],
    images: [
      'https://img.jakpost.net/c/2018/04/16/2018_04_16_44264_1523846364._large.jpg',
      'https://img.ev.mu/images/attractions/3190/960x640/767.jpg',
      'https://static.thehoneycombers.com/wp-content/uploads/sites/2/2017/06/Deepavali-Little-India.jpg'
    ],
  },
  {
    name: 'Chinatown',
    description:
      'Chinatown\'s maze of narrow roads includes Chinatown Food Street, with its restaurants serving traditional fare like Hainanese chicken rice, noodles and satay. Souvenir shops and indie boutiques dot the area, offering clothes, crafts and antiques, while Club Street is full of trendy wine bars.',
    reviews: [
      {
        text:
          'As its COVID, crowds are not as rampant as before. Still, due to the Chinese New Year, plenty of shops are selling CNY related products and food. Worth a visit!',
        score: 3,
      },
      {
        text:
          'Visited Chinatown during the Chinese new year. The entire are was decorated with lanterns, flowers and other beautiful things. It was an amazing experience walking through the markets, enjoying the various memorabilia available.',
        score: 4,
      },
    ],
    traffic: 'Very Crowded',
    weather: 'Small Drizzle',
    budget: [1,50],
    images: [
      'https://www.tripsavvy.com/thmb/UC5-XWBfnx2laUy4KNaojVIaH7M=/1500x1000/filters:fill(auto,1)/2_chinatown_street_market-5c459281c9e77c00018d54a2.jpg',
      'https://a.cdn-hotels.com/gdcs/production107/d741/f677ce0a-3f97-42ac-89e8-2e44cacf59b5.jpg',
      'https://static.thehoneycombers.com/wp-content/uploads/sites/2/2018/02/honeycombers-chinatown-darissa-lee-1.jpg'
    ],
  },
  {
    name: 'Ion Orchard',
    description:
      'ION Orchard, formerly known as the Orchard Turn Development or Orchard Turn Site, is a shopping mall in Singapore, next to Orchard MRT station.',
    reviews: [
      {
        text:
          'I strongly DO NOT RECOMMEND visit ION Orchard due to expensive parking fee. There only 10minute grace period thereafter s$4.28++ parking fee.',
        score: 1,
      },
      {
        text:
          'Absolutely love the night lights at Orchard Ion. This magnificent mall comes alive at night and I love the large screen that keeps viewers mesmerized with the ads that run. Quite an iconic place to hang out during the day and at night. The LV installation is quite a big hit !',
        score: 5,
      },
    ],
    traffic: 'Very Crowded',
    weather: 'Slight Breeze',
    budget: [5,100],
    images: [
      'https://www.capitaland.com/content/dam/capitaland-media-library/integrateddevelopment-urbandevelopment/Singapore/Singapore/ION%20Orchard/ION-Orchard-Interior-2-Apr-2019.jpg.transform/cap-midres/image.jpg',
      'https://i.ytimg.com/vi/7d0V5QuQDP0/maxresdefault.jpg',
      'https://foodinsing.com/wp-content/uploads/2017/06/ION-Orchard.jpg'
    ],
  },
  {
    name: 'Marina Bay Sands',
    description:
      'Visit Singapore\'s most iconic hotel for the world\'s largest rooftop Infinity Pool, award-winning dining, and a wide range of shopping and entertainment options.',
    reviews: [
      {
        text:
          'I and my friend booked this lovely hotel to celebrate her birthday. It was an amazing experience. Staff hospitality is on the highest level!',
        score: 5,
      },
      {
        text:
          'It was a very good experience to stay at Marina Bay Sands! Perfect room, perfect amenities, friendly staffs and good security measure during this Covid pandemic!',
        score: 4,
      },
    ],
    traffic: 'Very Crowded',
    weather: 'Rain & Thunder',
    budget: [30,500],
    images: [
      'https://theinnbox.co/images/mbs/17.jpg',
      'https://thetravelsisters.com/wp-content/uploads/2019/11/Marina-Bay-Sands-Hotel-Review.jpg',
      'https://www.asgam.com/wp-content/uploads/2019/08/Singapore-panorama-1140x737.jpg'
    ],
  },
  {
    name: 'Lau Pa Sat',
    description:
      'Lau Pa Sat is one of the most popular food markets, or what locals refer to as a "hawker centre", in the heart of Singapore\'s financial district.',
    reviews: [
      {
        text:
          'It is an iconic place. If you are tourist you should go at least once. Else, they are many other places that you should go for better local food.',
        score: 3,
      },
      {
        text:
          'Newly renovated so the place is rather clean and well ventilated. The food however, was expensive. There’re a lot of empty stall/booth and not much variety of food available.',
        score: 2,
      },
    ],
    traffic: 'Very Crowded',
    weather: 'Sunny',
    budget: [5, 50],
    images: [
      'https://static.thehoneycombers.com/wp-content/uploads/sites/2/2014/06/lau-pa-sat-by-night.jpg',
      'https://i.ytimg.com/vi/rEnCKDrvLns/maxresdefault.jpg',
      'https://www.tripsavvy.com/thmb/TMYTW3yoEuDWqpq4ad_3btXduRk=/3598x2768/filters:no_upscale():max_bytes(150000):strip_icc()/downtown-lau-pa-sat-old-festival-market-486555453-58e443805f9b58ef7e700987.jpg'
    ],
  },
  {
    name: 'National Museum',
    description:
      'The National Museum of Singapore is a museum in Singapore dedicated to the history of Singapore. It is the oldest museum in Singapore, with its history dating back to 1849, when it was started as a section of a library at Singapore Institution and called the Raffles Library and Museum.',
    reviews: [
      {
        text:
          'Great exhibitions. Informative, thought-provoking, and emotive. Loved the trip down memory lane too. Free for Singaporeans and permanent residents.  Go, go!',
        score: 5,
      },
      {
        text:
          'My fav museum in Singapore. went for the “home truly” exhibition, and it’s really an eye opening for me to learn more about the Singapore history.',
        score: 5,
      },
    ],
    traffic: 'A Little Crowded',
    weather: 'Windy',
    budget: [5, 20],
    images: [
      'https://zone-thebestsingapore-bhxtb9xxzrrdpzhqr.netdna-ssl.com/wp-content/uploads/2014/12/National-Museum-of-Singapore.jpg',
      'https://media.timeout.com/images/101805235/image.jpg',
      'https://www.channelnewsasia.com/image/13393696/16x9/1440/810/9325656d7f6c39705fca1c7d74b5dd5/vC/doraemon-national-museum-of-singapore-1.jpg',
    ],
  },
  {
    name: 'ArtScience Museum',
    description:
      'ArtScience Museum is a museum within the integrated resort of Marina Bay Sands in the Downtown Core of the Central Area in Singapore.',
    reviews: [
      {
        text:
          'The Art & Science Museum Building is quite unique and artistic. The location is amazing and the sights from outside and inside are both lovely.',
        score: 4,
      },
      {
        text:
          'We avail to visit the Future World Exhibition in Art & Science Museum and its amazing. Both kids and adults can enjoy the place. There you will experience being like in a magical world and outer space. Kids (and adults too) can make a piece of art and be projected in a large screen.',
        score: 5,
      },
    ],
    traffic: 'Crowded',
    weather: 'Sunny',
    budget: [20, 50],
    images: [
      'https://www.visitsingapore.com/see-do-singapore/arts/museums-galleries/artscience-museum/_jcr_content/par-carousel/carousel_detailpage/carousel/item_1.thumbnail.carousel-img.740.416.jpg',
      'https://www.visitsingapore.com/see-do-singapore/arts/museums-galleries/artscience-museum/_jcr_content/par-carousel/carousel_detailpage/carousel/item_2.thumbnail.carousel-img.740.416.jpg',
      'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1200,h_630,f_auto/w_80,x_15,y_15,g_south_west,l_klook_water/activities/bmovsfjedvgczv52bytt/ArtScience%20Museum%20at%20Marina%20Bay%20Sands%20Ticket.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b3/ArtScience_Museum%2C_Marina_Bay_Sands%2C_at_night._-_Singapore._%288416803612%29.jpg',
      'https://joinfull.com/uploads/slider/images/thumbs/art-science-museum-marina-bay-sands-singapore-9.jpg',
    ],
  },
  {
    name: 'Gardens By The Bay',
    description:
      'The Gardens by the Bay is a urban nature park spanning 110 hectares within the Marina Bay district of the Central Region of Singapore, adjacent to the Marina Reservoir. The park consists of three waterfront gardens: Bay South Garden, Bay East Garden and Bay Central Garden.',
    reviews: [
      {
        text:
          'There are 2 to 3 conservatories, the futuristic dome buildings are worth a visit. The super trees merely serve as decorations, not really very artistic. The public grounds is similar to the many public parks mainly green flora and trees.',
        score: 2,
      },
      {
        text:
          'Absolutely beautiful and breathtaking! There is so much to see here--gardens and waterfalls and everything in between. It feels like the Avatar movie come to life.',
        score: 4,
      },
    ],
    traffic: 'Very Crowded',
    weather: 'Cloudy',
    budget: [10, 20],
    images: [
      'https://www.tripsavvy.com/thmb/eN3zOkI0CBR6RageeS-Y1_uX2CM=/2121x1193/smart/filters:no_upscale()/gardens-by-the-bay-5a45387b7d4be800364c249b.jpg',
      'http://thetravellingstomach.com/wp-content/uploads/2018/03/DSCF6070.jpg',
      'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1200,h_630,f_auto/w_80,x_15,y_15,g_south_west,l_klook_water/activities/9658ba79-Gardens-by-the-Bay/Gardens%20by%20the%20Bay%20Ticket%20in%20Singapore.jpg',
      'https://dejiki.com/wp-content/uploads/2020/01/Gardens-by-the-Bay-2020-Future-Together-by-Teamlab-Japan-Outdoor-exhibit-Flowers-and-People-Giant-Lattice-Mass-a-Whole-Year-per-Hour.jpg',
    ],
  },
  {
    name: 'Singapore Art Museum',
    description:
      'The Singapore Art Museum is an art museum located in the Downtown Core district of Singapore. Formerly a 19th-century Catholic school, it is the first fully dedicated contemporary visual arts museum in Singapore with one of the world’s most important collections by local, Southeast and East Asian artists.',
    reviews: [
      {
        text:
          'An interesting Art Museum showing rare masterpieces of Claude Monet and other Impressionists. I expected less from this museum, but was impressed to see loaned masterpieces from European galleries, like dOrsay.',
        score: 5,
      },
      {
        text:
          'Beautiful arrangements and architecture, awesome building. We can get good clear picture about Singapore history and culture. I was enjoyed and learn lot about thire history.. Each and everyone should visit this place in your life time.',
        score: 4,
      },
    ],
    traffic: 'Minimal Crowds',
    weather: 'Slight Drizzle',
    budget: [0, 10],
    images: [
      'https://www.visitsingapore.com/see-do-singapore/arts/museums-galleries/singapore-art-museum/_jcr_content/par-carousel/carousel_detailpage/carousel/item_1.thumbnail.carousel-img.740.416.jpg',
      'https://www.visitsingapore.com/see-do-singapore/arts/museums-galleries/singapore-art-museum/_jcr_content/par-carousel/carousel_detailpage/carousel/item_2.thumbnail.carousel-img.740.416.jpg',
      'https://bk.asia-city.com/sites/default/files/sam-facade-2008.jpg',
    ],
  },
];

export function configureFakeBackend() {
  let realFetch = window.fetch;
  window.fetch = function (url, opts) {
    return new Promise((resolve, reject) => {
      // wrap in timeout to simulate server api call
      setTimeout(() => {
        // authenticate
        if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
          // get parameters from post request
          let params = JSON.parse(opts.body);

          // find if any user matches login credentials
          let filteredUsers = users.filter((user) => {
            return (
              user.username === params.username &&
              user.password === params.password
            );
          });

          if (filteredUsers.length) {
            // if login details are valid return user details and fake jwt token
            let user = filteredUsers[0];
            let responseJson = {
              id: user.id,
              username: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
              token: 'fake-jwt-token',
            };
            resolve({
              ok: true,
              text: () => Promise.resolve(JSON.stringify(responseJson)),
            });
          } else {
            // else return error
            reject('Username or password is incorrect');
          }

          return;
        }

        // register user
        if (url.endsWith('/users/register') && opts.method === 'POST') {
          // get new user object from post body
          let newUser = JSON.parse(opts.body);

          // validation
          let duplicateUser = users.filter((user) => {
            return user.username === newUser.username;
          }).length;
          if (duplicateUser) {
            reject('Username "' + newUser.username + '" is already taken');
            return;
          }

          // save new user
          newUser.id = users.length
            ? Math.max(...users.map((user) => user.id)) + 1
            : 1;
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));

          // respond 200 OK
          resolve({ ok: true, text: () => Promise.resolve() });

          return;
        }

        // get user by id
        if (url.match(/\/profile\/\d+$/) && opts.method === 'GET') {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (
            opts.headers &&
            opts.headers.Authorization === 'Bearer fake-jwt-token'
          ) {
            // find user by id in users array
            let urlParts = url.split('/');
            let id = parseInt(urlParts[urlParts.length - 1]);
            let matchedUsers = users.filter((user) => {
              return user.id === id;
            });
            let user = matchedUsers.length ? matchedUsers[0] : null;

            // respond 200 OK with user
            resolve({
              ok: true,
              text: () => Promise.resolve(JSON.stringify(buildDummyUser(user))),
            });
          } else {
            // return 401 not authorised if token is null or invalid
            reject('Unauthorised');
          }

          return;
        }

        // update user
        if (
          url.match(/\/profile\/\d+$/) &&
          (opts.method === 'POST' || opts.method === 'PATCH')
        ) {
          resolve({ ok: true, text: () => Promise.resolve() });

          return;
        }

        // get recommendation
        if (
          (url.endsWith('/recommendation') ||
            url.match(/\/recommendation\/\d+$/)) &&
          (opts.method === 'GET' || opts.method === 'POST')
        ) {
          resolve({
            ok: true,
            text: () =>
              Promise.resolve(
                JSON.stringify(
                  dummyRecommendations[
                    Math.floor(Math.random() * dummyRecommendations.length)
                  ]
                )
              ),
          });

          return;
        }

        // get profile values
        if (url.endsWith('/profile/available') && opts.method === 'GET') {
          // respond 200 OK
          resolve({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(dummyProfileValues)),
          });

          return;
        }

        // pass through any requests not handled above
        realFetch(url, opts).then((response) => resolve(response));
      }, FAKE_DELAY_MS);
    });
  };
}
