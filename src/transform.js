/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* Dummy record transformer for the Melinda record batch import system
*
* Copyright (C) 2018 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-record-import-transformer-dummy
*
* melinda-record-import-transformer-dummy program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* melinda-record-import-transformer-dummy is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/

import getStream from 'get-stream';
import {MarcRecord} from '@natlibfi/marc-record';

export default async function (stream) {
	MarcRecord.setValidationOptions({subfieldValues: false});
	const config = await getConfig();

	if (config.fail) {
		throw new Error('Failing as requested');
	}

	return config.records.map((valid, index) => {
		const record = new MarcRecord({
			leader: '00000ngm a22005774i 4500',
			fields: [
				{
					tag: '008',
					value: '000000s2018    fi ||| g^    |    v|mul|c'
				},
				{
					tag: '024',
					subfields: [{code: 'a', value: `000000${index}`}]
				},
				{
					tag: '245',
					subfields: [{code: 'a', value: `foobar${index}`}]
				}
			]
		});

		if (valid) {
			return record;
		}

		record.appendField({tag: 'FOO', value: 'bar'});
		return record;
	});

	async function getConfig() {
		const data = await getStream(stream);
		const defaults = {
			records: new Array(5).fill(true)
		};

		if (data) {
			return {...defaults, ...JSON.parse(data)};
		}

		return defaults;
	}
}
