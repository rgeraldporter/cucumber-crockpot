# Crockpot

A very simple templater for [Cucumber](https://cucumber.io/) files, using [mustache](https://www.npmjs.com/package/mustache).

## Installation

As per standard npm installs...

```
npm i cucumber-crockpot -D
```

Change `-D` to `-S` is this is not a devDependency.

Import to your project as follows:

```
const crockpot = require('cucumber-crockpot');
```

## File format

A `.crock` file is merely a valid `.feature` file with some templated contents using `mustache`.

An example file might look like:

```
@{{name}}
Feature: {{nameCapital}} Display

  Scenario: Buying {{indefiniteArticle}} {{name}}

    Given we have 50 {{namePlural}}
    When we sell {{indefiniteArticle}} {{name}}
    Then we receieve {{price}}
    And we have 49 {{namePlural}} remaining
```

with a paired `.view.json` file as such:

```json
[
    {
        "name": "apple",
        "namePlural": "apples",
        "indefiniteArticle": "an",
        "nameCapital": "Apple",
        "price": "$0.76"
    },
    {
        "name": "banana",
        "namePlural": "bananas",
        "indefiniteArticle": "a",
        "nameCapital": "Banana",
        "price": "$0.16"
    },
    {
        "name": "currant",
        "namePlural": "currants",
        "indefiniteArticle": "a",
        "nameCapital": "Currant",
        "price": "$0.06"
    },
    {
        "name": "durian",
        "namePlural": "durians",
        "indefiniteArticle": "a",
        "nameCapital": "Durian",
        "price": "$1.56"
    }
]
```

And this would result in `.feature` files like this:

```
@apple
Feature: Apple Display

  Scenario: Buying an apple

    Given we have 50 apples
    When we sell an apple
    Then we receieve $0.76
    And we have 49 apples remaining
```

## API

Currently, only two functions are exposed, which you can import:

 * `parse`: Takes an object with two properties: `crock` and `view`, each a paths to their respective files.
 * `setFeaturePath`: This changes the path for exporting resulting `.feature` files to whatever path you provide. Without using this, the default is the `./features` folder in your project.

### Example use of API

This example will take a `./crockpots/` directory, that contains a folder for each featureset, and process every `.crock` & `.view.js` file.

```js
const crockpot = require('cucumber-crockpot');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const dirs = p =>
    readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());

const crockpots = dirs('./crockpots/');

crockpot.setFeaturePath('./product-features/');

crockpots.map(pot =>
    crockpot.parse({
        crock: `./crockpots/${pot}/${pot}.crock`,
        view: `./crockpots/${pot}/${pot}.view.json`
    })
);
```

## Recommendations

Since the crock files are the "source of truth" for your Cucumber tests when using it, I recommend you have Crockpot export its files into a directory not tracked by Git or any source control systems. As long as you keep your crock & view files, you can always regenerate these files.

## Roadmap

In the pre-1.x phase I'll be looking into the possibility of combining the crock & view files together, but only as an option -- seperate files will always be supported.

I don't currently foresee adding any more complexity to the `.crock` file beyond this, but I am open to suggestions.