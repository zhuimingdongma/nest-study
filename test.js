const autocannon = require('autocannon');

autocannon(
  {
    url: 'http://localhost:5000/goods/view/one?id=4c854188-5244-4315-9627-28274f946f2c',
    headers: {
      accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMDA1YjQ0Yy1kZDhhLTQxYWUtOTA2NS1kMzY1ZDYxYzI5ZTciLCJ1c2VybmFtZSI6IuWGrOmprOWSjOe6sSIsImlhdCI6MTcwMDc4OTgwOCwiZXhwIjoxNzEzNzQ5ODA4fQ.IT3vwZAhEIyGQgeeNYPNULKbzp50Y33UcfJcmVQRWmo',
    },
    method: 'GET',
    connections: 1000,
    pipelining: 1,
    duration: 5,
  },
  console.log,
);
