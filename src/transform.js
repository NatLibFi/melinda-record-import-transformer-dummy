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

import {chain} from 'stream-chain';
import {parser} from 'stream-json';
import {streamArray} from 'stream-json/streamers/StreamArray';
import {MarcRecord} from '@natlibfi/marc-record';
import validator from './validate';
import moment from 'moment';

export default async function (stream, Emitter, validate = true, fix = true) {
	MarcRecord.setValidationOptions({subfieldValues: false});
	let pipeline;
	let counter = 0;
	const defaults = {
		records: new Array(5).fill(true)
	};
	let promises = [];

	try {
		if (stream) {
			pipeline = chain([
				stream,
				parser(),
				streamArray()
			]);

			pipeline.on('data', async data => {
				counter++;
				promises.push(transform(data.value));
				async function transform(value) {
					const result = await convertRecord(value, validate, fix);
					Emitter.emit('record', result);
				}
			});
			pipeline.on('end', async () => {
				console.log(`: Handled ${counter} recordEvents`);
				await Promise.all(promises);
				Emitter.emit('end', counter);
			});
		} else {
			console.log('debug', `Dummy logger did not get stream. Pushing ${defaults.leanght} dummy records from defaults`);
			defaults.array.forEach(data => {
				counter++;
				promises.push(transform(data));
				async function transform(value) {
					const result = await convertRecord(value, validate, fix);
					Emitter.emit('record', result);
				}
			});
			await Promise.all(promises);
			Emitter.emit('end', counter);
		}
	} catch (err) {
		Emitter.emit('error', err);
	}

	// If inputData is boolean false output record is failed record
	async function convertRecord(inputData, validate, fix) {
		const creationDate = moment().format('YYMMDD');
		let record = new MarcRecord({
			leader: '00000ngm a22005774i 4500',
			fields: [
				{
					tag: '008',
					value: `${creationDate}    fi ||| g^    |    v|mul|c`
				},
				{
					tag: '024',
					subfields: [{code: 'a', value: `000000${counter}`}]
				},
				{
					tag: '245',
					subfields: [{code: 'a', value: `foobar${counter}`}]
				}
			]
		});

		if (inputData === false) {
			record.appendField({tag: 'FOO', value: 'bar'});
		}

		if (validate === true || fix === true) {
			return validator(record, validate, fix);
		}

		// No validation or fix = all succes!
		return {failed: false, record: {...record}};
	}
}
