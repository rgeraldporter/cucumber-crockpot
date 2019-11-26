import mustache from 'mustache';
import * as fsx from 'fs-extra';
import { Inquiry, InquiryP, Pass, Fail } from 'inquiry-monad';
import R from 'ramda';

let featurePath = './features/';

const outputFiles = (picklejar: any) =>
    fsx.outputFileSync(
        `${featurePath}crockpot/${picklejar.view.name}.feature`,
        picklejar.content
    );

const templateCrock = (crock: string) => (view: Object) => ({
    content: mustache.render(crock, view),
    view: view
});

// @todo handle crock with views within
const processComplexBatch = (batch: any) => {};

const pickle = (batch: any) =>
    Array.isArray(batch.views)
        ? batch.views.map(templateCrock(batch.crock)).map(outputFiles)
        : processComplexBatch(batch);

const loadViews = (args: any) =>
    fsx
        .readJson(args.view)
        .then(json => Pass({ json }))
        .catch(Fail);

const loadCrock = (args: any) =>
    fsx
        .readFile(args.crock, 'utf-8')
        .then((content: string) => Pass({ content }))
        .catch(Fail);

const parse = <T>(args: T | any) =>
    InquiryP.subject(args)
        .inquire(loadViews)
        .inquire(loadCrock)
        .fold(
            (x: any) => {
                // we had something pass
                // as long as that something is the crock we're good
                const results = x.join().map((pass: any) => {
                    return pass.content
                        ? { crock: pass.content }
                        : { views: pass.json };
                });

                pickle(R.mergeAll(results));
            },
            (y: any) => {
                // nothing passed
                // throw error log out ther
                console.error('You must have a crock file and/or a view file.');
                console.error(y.join());
            }
        );

const setFeaturePath = (path: string) => (featurePath = path);

export { parse, setFeaturePath };
