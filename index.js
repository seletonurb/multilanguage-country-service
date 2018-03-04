(function() {
  'use strict';

  var searchCountryService = {},
    _ = require('underscore'),
    allCountries = require('./search-countries.json');

  /**
   * Create filter function for a query string:
   * takes the array in all languages as input, lowercase them all and return the matches
   */
  var createFilterFor = function(query) {
    var lowercaseQuery = (query || '').toLowerCase();

    return function filterFn(item) {
      var allLanguagesItemLabels;
      var lowercaseItemLabels;

      allLanguagesItemLabels = JSON.stringify(item.labels);
      lowercaseItemLabels = allLanguagesItemLabels.toLowerCase();

      return (lowercaseItemLabels.indexOf(lowercaseQuery) !== -1);
    };
  };

  /**
   * Returns a list of countries that matches the criteria
   */
  searchCountryService.search = function(searchQuery, language) {
    var results;

    results = searchQuery ? allCountries.filter(createFilterFor(searchQuery)) : [];

    _.each(results, function(result) {
      switch (language) {
        case 'en':
          result.name = result.labels[0];
          break;
        case 'pt':
          result.name = result.labels[1];
          break;
        default:
          result.name = result.labels[0];
      }
    });
    return results;
  };

  /**
   * Populates country object from country code.
   */
  searchCountryService.populateCountry = function(country) {
    var result;

    if (!(country || country.code)) {
      return;
    }

    result = _.findWhere(allCountries, {
      code: country.code
    });

    if (!result) {
      return;
    }

    country = result;
    country.name = searchCountryService.getLabel(country, language);
  };

  /**
   * Retrieves a country from country code.
   * Returns undefined if not found
   */
  searchCountryService.getCountry = function(countryCode, language) {
    var country;

    // in case language is not specified, sets default language
    language = language || 'en';

    country = _.findWhere(allCountries, {
      code: countryCode
    });
    if (country) {
      country.name = searchCountryService.getLabel(country, language);
    }
    return country;
  };

  /**
   * Returns a label for a country according to the language passed as parameter
   */
  searchCountryService.getLabel = function(country, language) {
    var label;

    switch (language) {
      case 'en':
        label = country.labels[0];
        break;
      case 'pt':
        label = country.labels[1];
        break;
      default:
        label = country.labels[0];
    }

    return label;
  };

  module.exports = searchCountryService;

})();
