import * as fsx from 'fs-extra';
import { parse, setFeaturePath } from './index';

setFeaturePath('./test-feature-path/');

describe('the crockpot parse function', () => {
    it('should be able to parse example files', done => {
        parse({
            crock: './examples/fruits/fruit-stand.crock',
            view: './examples/fruits/fruit-stand.view.json'
        });
        setTimeout(
            () =>
                fsx
                    .readFile(
                        './test-feature-path/crockpot/apple.feature',
                        'utf-8'
                    )
                    .then((content: string) => {
                        expect(content).toBe(
`@apple
Feature: Apple Display

  Scenario: Buying an apple

    Given we have 50 apples
    When we sell an apple
    Then we receieve $0.76
    And we have 49 apples remaining
`);
                        done();
                    }),
            2000
        );
    });
});
