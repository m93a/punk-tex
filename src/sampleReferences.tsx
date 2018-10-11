import Reference from './Reference';

const params: Map<string, Reference.Params> =
new Map([

    ['mljs-lm', {
        id: 'mljs-lm',
        title: 'GitHub',
        partTitle: 'Levenberg-marquardt',
        partSubtitle: 'Curve fitting method in javascript',
        authors:
        {
            names: [
                { name: 'Miguel Angel', surname: 'Asencio Hurtado' },
                { name: 'Jose Alejandro', surname: 'Bolanos Arroyave'},
                { name: 'Michaël', surname: 'Zasso'}
            ],
            etAl: false
        },
        datePublished: 'Aug 22, 2018',
        referenced: new Date('2018-09-10'),
        online: true,
        url: new URL("https://github.com/mljs/levenberg-marquardt")
    }],

    ['recipes-fortran-77', {
        id: 'recipes-fortran-77',
        title: 'Numerical Recipes in Fortran 77',
        subtitle: 'The Art of Scientific Computing',
        edition: '2nd ed.',
        authors:
        {
            names: [
                { name: 'William H.', surname: 'Press' }
            ],
            etAl: false
        },
        placePublished: 'Cambridge: Cambridge University Press',
        datePublished: '1992',
        identifier: "ISBN 05-214-3064-X",
        url: new URL("https://websites.pmc.ucsc.edu/~fnimmo/eart290c_17/NumericalRecipesinF77.pdf")
    }]

]);

export default params;