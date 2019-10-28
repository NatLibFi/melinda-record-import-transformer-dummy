/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* Dummy record transformer for the Melinda record batch import system
*
* Copyright (c) 2018-2019 University Of Helsinki (The National Library Of Finland)
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

export default (record, fix, validateFixes) => {
	const validate = record => {
		if (record.get(/^FOO$/).length > 0) {
			return {
				record,
				valid: false,
				report: ['Invalid as requested']
			};
		}

		return {
			record,
			valid: true,
			report: [`Opts given to validator: fix: ${fix}, validateFixes: ${validateFixes}`]
		};
	};

	const result = validate(record);
	return {
		record: result.record,
		failed: result.valid === false,
		messages: result.report
	};
};
