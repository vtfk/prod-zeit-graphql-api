const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  validateSchema
} = require('graphql')


const PersonType = require('./schema-type-person')

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      persons: {
        type: new GraphQLList(PersonType),
        args: {
          personalId: {
            type: new GraphQLList(GraphQLString),
            description: '[11 chars] This is an unique ID for persons in Norway. AKA fødselsnummer'
          }
        },
        resolve: (root, args) => {
          if (!args.personalId) throw Error(`Parameter 'personalId' is required`)

          return args.personalId.map(id => {
            // Check if id is exactly 11 digits using regex
            // Valid ids will be processed.
            if (!(RegExp(/^\d{11}$/).exec(id))) {
              throw Error(`Parameter 'personalId' with value '${id}' is not 11 chars or contains non-integer characters`)
            }

            return { id: id }
          })
        }
      }
    })
  })
})

// Schema validation, throws if error.
const schemaErrors = validateSchema(schema)
if (schemaErrors.length > 0) {
  throw Error(`Error in schema: \n${schemaErrors}`)
}
console.log('Validated schema imported...')

module.exports = schema


/* DSF?
{
  "FODT": "010107",
  "PERS": "50160",
  "INR": "18117108976",
  "FODTAR": "2007",
  "STAT-KD": "1",
  "STAT": "BOSATT",
  "NAVN-S": "GRÅ",
  "NAVN-F": "GANDALF",
  "NAVN-M": "GEORG",
  "NAVN": "GRÅ GANDALF GEORG",
  "ADR": "FYLKESBAKKEN 10",
  "POSTN": "3715",
  "POSTS": "SKIEN",
  "SPES-KD": "0",
  "SPES": "VANLIG BOSATT"
}
*/

/* Full DSF?
<...>
<FODT> tns:Tfodt </FODT> [1] ?
<PERS> tns:Tpers </PERS> [0..1] ?
<INR> tns:Tinr </INR> [0..1] ?
<FODTAR> tns:Tfodtaar </FODTAR> [0..1] ?
<STAT-KD> tns:Tkode </STAT-KD> [0..1] ?
<STAT> xsd:string </STAT> [0..1] ?
<STAT-D> tns:Tdato </STAT-D> [0..1] ?
<DNR-D> tns:Tdato </DNR-D> [0..1] ?
<NAVN-S> tns:Tnavn </NAVN-S> [0..1] ?
<NAVN-F> tns:Tnavn </NAVN-F> [0..1] ?
<NAVN-M> tns:Tnavn </NAVN-M> [0..1] ?
<NAVN-U> tns:Tnavn </NAVN-U> [0..1] ?
<NAVN> tns:Tnavnkort </NAVN> [0..1] ?
<NAVN-D> tns:Tdato </NAVN-D> [0..1] ?
<ADRR> tns:Tdato </ADRR> [0..1] ?
<ADRF> tns:Tdato </ADRF> [0..1] ?
<ADR> tns:Tadr </ADR> [0..1] ?
<POSTN> tns:Tpostnr </POSTN> [0..1] ?
<POSTS> tns:Tpoststed </POSTS> [0..1] ?
<ADR-T> xsd:string </ADR-T> [0..1] ?
<KOMNR> tns:Tkomnr </KOMNR> [0..1] ?
<KOMNA> tns:Tkomnavn </KOMNA> [0..1] ?
<REKVNR> tns:Trekvnr </REKVNR> [0..1] ?
<REKVNAVN> tns:Trekvnavn </REKVNAVN> [0..1] ?
<GATE> tns:Tgatenr </GATE> [0..1] ?
<HUS> tns:Thusnr </HUS> [0..1] ?
<BOKS> tns:Tbokstav </BOKS> [0..1] ?
<GARD> tns:Tgardnr </GARD> [0..1] ?
<BRUK> tns:Tbruksnr </BRUK> [0..1] ?
<FEST> tns:Tfestenr </FEST> [0..1] ?
<UND> tns:Tundernr </UND> [0..1] ?
<ADRTYPE> xsd:string </ADRTYPE> [0..1] ?
<BOLIGNR> tns:Tbolignr </BOLIGNR> [0..1] ?
<ADR1> tns:Tadr </ADR1> [0..1] ?
<ADR2> tns:Tadr </ADR2> [0..1] ?
<ADR3> tns:Tadr </ADR3> [0..1] ?
<ADRL-KD> tns:Tlandkode </ADRL-KD> [0..1] ?
<ADRL> xsd:string </ADRL> [0..1] ?
<POSTADRDA> tns:Tdato </POSTADRDA> [0..1] ?
<INVF> tns:Tlandkode </INVF> [0..1] ?
<INVF-N> tns:Tlandnavn </INVF-N> [0..1] ?
<INVF-R> tns:Tdato </INVF-R> [0..1] ?
<INVF-F> tns:Tdato </INVF-F> [0..1] ?
<FKOM> tns:Tkomnr </FKOM> [0..1] ?
<FKOM-N> tns:Tkomnavn </FKOM-N> [0..1] ?
<FKOM-R> tns:Tdato </FKOM-R> [0..1] ?
<FKOM-F> tns:Tdato </FKOM-F> [0..1] ?
<UTVT> tns:Tlandkode </UTVT> [0..1] ?
<UTVT-N> tns:Tlandnavn </UTVT-N> [0..1] ?
<UTVT-R> tns:Tdato </UTVT-R> [0..1] ?
<UTVT-F> tns:Tdato </UTVT-F> [0..1] ?
<UTVTYPE> xsd:string (length <= 1) </UTVTYPE> [0..1] ?
<AARSADR> xsd:string </AARSADR> [0..1] ?
<SPES-KD> tns:Tkode </SPES-KD> [0..1] ?
<SPES> xsd:string </SPES> [0..1] ?
<SPES-D> tns:Tdato </SPES-D> [0..1] ?
<SKKR> tns:Tkrets </SKKR> [0..1] ?
<VAKR> tns:Tkrets </VAKR> [0..1] ?
<GRUNNKR> tns:Tgrunnkr </GRUNNKR> [0..1] ?
<MELD> xsd:string </MELD> [0..1] ?
<K-FAMNR> xsd:string </K-FAMNR> [0..1] ?
<FAMNR-D> tns:Tdato </FAMNR-D> [0..1] ?
<PERSKODE> tns:Tkode </PERSKODE> [0..1] ?
<EKT-FODT> tns:Tfodt </EKT-FODT> [0..1] ?
<EKT-PERS> tns:Tpers </EKT-PERS> [0..1] ?
<EKT-INR> tns:Tinr </EKT-INR> [0..1] ?
<EKT-NAV> tns:Tnavn </EKT-NAV> [0..1] ?
<EKT-STBKD> tns:TstatsbKode </EKT-STBKD> [0..1] ?
<EKT-STB> tns:Tlandnavn </EKT-STB> [0..1] ?
<EKT-KJONN> tns:Tkjonn </EKT-KJONN> [0..1] ?
<Barn> tns:Barn </Barn> [0..30]
<MOR-FODT> tns:Tfodt </MOR-FODT> [0..1] ?
<MOR-PERS> tns:Tpers </MOR-PERS> [0..1] ?
<MOR-INR> tns:Tinr </MOR-INR> [0..1] ?
<MOR-NAV> tns:Tnavn </MOR-NAV> [0..1] ?
<MOR-STBKD> tns:TstatsbKode </MOR-STBKD> [0..1] ?
<MOR-STB> tns:Tlandnavn </MOR-STB> [0..1] ?
<MOR-KJONN> tns:Tkjonn </MOR-KJONN> [0..1] ?
<FAR-FODT> tns:Tfodt </FAR-FODT> [0..1] ?
<FAR-PERS> tns:Tpers </FAR-PERS> [0..1] ?
<FAR-INR> tns:Tinr </FAR-INR> [0..1] ?
<FAR-NAV> tns:Tnavn </FAR-NAV> [0..1] ?
<FAR-STBKD> tns:TstatsbKode </FAR-STBKD> [0..1] ?
<FAR-STB> tns:Tlandnavn </FAR-STB> [0..1] ?
<FAR-KJONN> tns:Tkjonn </FAR-KJONN> [0..1] ?
<SIVS-KD> tns:Tkode </SIVS-KD> [0..1] ?
<SIVS> xsd:string </SIVS> [0..1] ?
<SIVS-D> tns:Tdato </SIVS-D> [0..1] ?
<AARSSIV> tns:Taarsakkode </AARSSIV> [0..1] ?
<Statsborgerskap> [0..10]
<STATB-KD> tns:TstatsbKode </STATB-KD> [0..1] ?
<STATB> tns:Tlandnavn </STATB> [0..1] ?
<STATBD> tns:Tdato </STATBD> [0..1] ?
</Statsborgerskap>
<KJONN> tns:Tkjonn </KJONN> [0..1] ?
<AARSNVN> tns:Taarsakkode </AARSNVN> [0..1] ?
<FODKNR> xsd:string </FODKNR> [0..1] ?
<FODK> tns:Tkomland </FODK> [0..1] ?
<FODS> tns:Tkomnavn </FODS> [0..1] ?
<SAMEMT> tns:Tkode </SAMEMT> [0..1] ?
<SAMEMT-D> tns:Tdato </SAMEMT-D> [0..1] ?
<UMYND> xsd:string </UMYND> [0..1] ?
<UMYNDD> tns:Tdato </UMYNDD> [0..1] ?
<FORAN-KD> tns:Tkode </FORAN-KD> [0..1] ?
<FORAN> xsd:string </FORAN> [0..1] ?
<FORAND> tns:Tdato </FORAND> [0..1] ?
<OPPHT-KD> tns:Tkode </OPPHT-KD> [0..1] ?
<OPPHT> xsd:string </OPPHT> [0..1] ?
<OPPHT-D> tns:Tdato </OPPHT-D> [0..1] ?
<DUFNR> tns:Tdufnr </DUFNR> [0..1] ?
<TIDLFNR> tns:Tfnr </TIDLFNR> [0..1] ?
<DNRFNR-D> tns:Tdato </DNRFNR-D> [0..1] ?
<NYTTFNR> tns:Tfnr </NYTTFNR> [0..1] ?
<NYTTFNR-D> tns:Tdato </NYTTFNR-D> [0..1] ?
<MEDLK> tns:Tjanei </MEDLK> [0..1] ?
<TK-NR> tns:Ttknr </TK-NR> [0..1] ?
<HJEMLADR1> tns:Tadr </HJEMLADR1> [0..1] ?
<HJEMLADR2> tns:Tadr </HJEMLADR2> [0..1] ?
<HJEMLADR3> tns:Tadr </HJEMLADR3> [0..1] ?
<HJEMLKODE> xsd:string (length <= 3) </HJEMLKODE> [0..1] ?
<HJEMLAND> xsd:string (length <= 40) </HJEMLAND> [0..1] ?
<HJEMLREGD> tns:Tdato </HJEMLREGD> [0..1] ?
<VISTLEG> xsd:string (length <= 1) </VISTLEG> [0..1] ?
<BIBEHOLD> ... </BIBEHOLD> [0..1] ?
<BIBHREGD> ... </BIBHREGD> [0..1] ?
<Vergemaalinfo> tns:Vergemaalinfo </Vergemaalinfo> [0..*]
<VERGEMAAL> xsd:string (length <= 1) </VERGEMAAL> [0..1] ?
<FREMTIDSFULLMAKT> xsd:string (length <= 1) </FREMTIDSFULLMAKT> [0..1] ?
</...>
*/
