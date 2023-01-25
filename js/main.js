/**
 * HebrewTools TransliterationHelper
 * Copyright (C) 2022  Camil Staps
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

(() => {
	if (typeof ClipboardItem === 'undefined') {
		let header = document.getElementById('header');
		header.className = 'failure';
		header.innerHTML =
			'This browser does not fully support copying; copying overscript minuscules will not work. ' +
			'If you are using Firefox, consider setting ' +
			'<tt>dom.events.asyncClipboard.clipboardItem</tt> to <tt>true</tt> ' +
			'in <tt>about:config</tt>.';
	}

	function addSymbol(type, hebrew_char, transliterated_char, uppercase_char) {
		let hebrew = document.createElement('div');
		hebrew.classList.add('hebrew', 'inline-block');
		hebrew.textContent = hebrew_char;

		let transliteration = document.createElement('span');
		transliteration.className = 'transliteration';
		transliteration.innerHTML = transliterated_char;

		let symbol_text_child = document.createElement('div');
		symbol_text_child.appendChild(hebrew);
		symbol_text_child.appendChild(transliteration);

		let symbol_text = document.createElement('div');
		symbol_text.className = 'symbol-text';
		symbol_text.appendChild(symbol_text_child);

		let symbol_content = document.createElement('div');
		symbol_content.className = 'symbol-content';
		symbol_content.appendChild(symbol_text);

		let node = document.createElement('div');
		node.classList.add('symbol', type);
		node.appendChild(symbol_content);

		let main = document.getElementById('main');
		main.appendChild(node);

		let feedback = document.createElement('div');
		feedback.className = 'feedback';
		node.appendChild(feedback);

		function copy(uppercase=false) {
			if (uppercase) {
				if (typeof uppercase_char === 'undefined') {
					window.alert('This character has no uppercase variant.');
					return;
				}

				transliterated_char = uppercase_char;
			}

			let promise = null;
			if (typeof ClipboardItem !== 'undefined') {
				let type = 'text/html';
				let blob = new Blob(['<i>' + transliterated_char + '</i>'], {type});
				let data = [new ClipboardItem({ [type]: blob })];
				promise = navigator.clipboard.write(data);
			} else {
				promise = navigator.clipboard.writeText(transliteration.innerText);
			}

			promise.then(
				() => {
					feedback.textContent = 'copied!';
					feedback.classList.add('success');
				},
				() => {
					feedback.textContent = 'copying failed';
					feedback.classList.add('failure');
				}).finally(() => {
					window.setTimeout(() => {
						feedback.textContent = '';
						feedback.classList.remove('success', 'failure');
					}, 1000);
				});
		}

		node.onclick = (e) => { copy(e.detail >= 2); };
	}

	let consonants = {
		'א': '\u02be',
		'ב': '\u1e07',
		'ג': '\u1e21',
		'ד': '\u1e0f',
		'ח': '\u1e25',
		'ט': '\u1e6d',
		'כ': '\u1e35',
		'ע': '\u02bf',
		'פ': 'p\u0304',
		'צ': '\u1e63',
		'שׂ': '\u015b',
		'שׁ': '\u0161',
		'ת': '\u1e6f',
	};
	let vowels = {
		'◌ָ':  ['\u0101', '\u014f'],
		'◌ָה': ['\u00e2'],
		'◌ֶ':  ['\u0119'],
		'◌ֶה': ['\u0119\u0304'],
		'◌ֵ':  ['\u0113'],
		'◌ֵי': ['\u00ea'],
		'◌ִ':  ['\u012b'],
		'◌ִי': ['\u00ee'],
		'◌ֹ':  ['\u014d'],
		'◌וֹ': ['\u00f4'],
		'◌ֻ':  ['\u016b'],
		'◌וּ': ['\u00fb'],
		'◌ְ':  ['<sup>e</sup>'],
		'◌ֳ':  ['<sup>o</sup>'],
		'◌ֲ':  ['<sup>a</sup>'],
		'◌ֱ':  ['<sup>\u0119</sup>'],
	};
	let uppercase = {
		'\u02be':  '\u02be', // aleph is the same in uppercase
		'\u1e07':  '\u1e06',
		'\u1e21':  '\u1e20',
		'\u1e0f':  '\u1e0e',
		'\u1e25':  '\u1e24',
		'\u1e6d':  '\u1e6c',
		'\u1e35':  '\u1e34',
		'\u02bf':  '\u02bf', // ayin is the same in uppercase
		'p\u0304': 'P\u0304',
		'\u1e63':  '\u1e62',
		'\u015b':  '\u015a',
		'\u0161':  '\u0160',
		'\u1e6f':  '\u1e6e',

		'\u0101': '\u0100',
		'\u014f': '\u014e',
		'\u00e2': '\u00c2',
		'\u0119': '\u0118',
		'\u0119\u0304': '\u0118\u0304',
		'\u0113': '\u0112',
		'\u00ea': '\u00ca',
		'\u012b': '\u012a',
		'\u00ee': '\u00ce',
		'\u014d': '\u014c',
		'\u00f4': '\u00d4',
		'\u016b': '\u016a',
		'\u00fb': '\u00db',
		'<sup>a</sup>': '<sup>A</sup>',
		'<sup>e</sup>': '<sup>E</sup>',
		'<sup>o</sup>': '<sup>O</sup>',
		'<sup>\u0119</sup>': '<sup>\u0118</sup>',
	};

	for (let sym in consonants)
		addSymbol('consonant', sym, consonants[sym], uppercase[consonants[sym]]);
	for (let sym in vowels)
		for (let transliteration of vowels[sym])
			addSymbol('vowel', sym, transliteration, uppercase[transliteration]);
})();
