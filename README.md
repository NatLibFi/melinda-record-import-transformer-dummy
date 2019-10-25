# Dummy record transformer for the Melinda record batch import system  [![Build Status](https://travis-ci.org/NatLibFi/melinda-record-import-transformer-dummy.svg)](https://travis-ci.org/NatLibFi/melinda-record-import-transformer-dummy) [![Test Coverage](https://codeclimate.com/github/NatLibFi/melinda-record-import-transformer-dummy/badges/coverage.svg)](https://codeclimate.com/github/NatLibFi/melinda-record-import-transformer-dummy/coverage)

Dummy record transformer for the Melinda record batch import system. Consumes records as represented by Helmet's [Sierra ILS](https://sandbox.iii.com/iii/sierra-api/swagger/index.html)

## License and copyright

Copyright (c) 2018 **University Of Helsinki (The National Library Of Finland)**

This project's source code is licensed under the terms of **GNU Affero General Public License Version 3** or any later version.

## Usage
Default options: validated: true and fix: true
Usage of [@natlibfi/melinda-record-import-cli](https://www.npmjs.com/package/@natlibfi/melinda-record-import-cli) is recommended

### Input data
Stream containing `[Object]`, `[Boolean]` or `[]`. Example: `[{record: {..}}]` or `[true,true,false]`.
In case of empty array dummy will generate array containing 5 boolean true values `[true, true, true, true, true]`

### Output data
Boolean values will generate valid and invalid records.
Obect type imput will be always converted to valid record.

Examples can be found in the folder
