// You may wish to find an effective randomizer function on MDN.

function range(int) {
  const arr = [];
  for (let i = 0; i < int; i += 1) {
    arr.push(i);
  }
  return arr;
}

function sortFunction(a, b, key) {
  if (a[key] < b[key]) {
    return -1;
  } if (a[key] > b[key]) {
    return 1;
  }
  return 0;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

document.body.addEventListener('submit', async (e) => {
  e.preventDefault(); // this stops whatever the browser wanted to do itself.
  const form = $(e.target).serializeArray(); // here we're using jQuery to serialize the form
  fetch('/api6', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then((fromServer) => fromServer.json())
    .then((fromServer) => {
      // You're going to do your lab work in here. Replace this comment.
      console.log('fromServer', fromServer);

      // 10. Find a list of 10 random countries.
      // create an array of 10 elements
      const arr = range(10);
      // loop over 10 elements
      const randomCountries = arr.map(index => {
        // get a random number
        let maxCountryCount = fromServer.length;
        let randomNum = getRandomInt(maxCountryCount);
        // get country at the position
        let country = fromServer[randomNum];
        // remove the country at the position
        fromServer.splice(randomNum, 1);
        return country;
      })
      console.log("List of Random Countries.")
      console.table(randomCountries);

      // 11. sort the list of countries in reverse alphabetical order
      const sortedCountries = randomCountries.sort(function(a, b) {
        return sortFunction(b, a, 'name');
      });
      console.log("Sorted List of Countries")
      console.table(sortedCountries);

      // 14. remove  the .flex-inner element
      $( ".flex-outer > form > .flex-inner" ).remove();

      // 12. inject the ordered list with class "flex-inner" 
      $( ".flex-outer > form" ).prepend( "<ol class='flex-inner'></ol>" );

      // 13. inject the list of country into "flex-inner"
      const liArr = sortedCountries.map(country => {
        return '<li>' +
                '<input type="checkbox" id="countries_' + country.code + '" name="countries" value="' + 
                    country.code + '">' +
                '<label for="countries_' + country.code + '">' + country.name + '</label>' +
              '</li>';
      });
      console.log("li array");
      console.table(liArr);
      $(".flex-inner").append(liArr);

    })
    .catch((err) => console.log(err));
});