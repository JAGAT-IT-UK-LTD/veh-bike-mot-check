/*
 * The paid vehicle-history report, proved against recorded supplier answers.
 *
 *   node test/history.test.js
 *
 * No network call of any kind. One Auto's AutoCheck costs about two pounds a
 * lookup, so nothing here, and no deploy step, may touch the live endpoint:
 * the owner's rule since 10 October 2026 after test lookups burned fourteen
 * pounds. This reads two recorded JSON files off disk instead.
 *
 * It exists to stop the one mistake ADAPTER.md calls the worst a car check can
 * make: a plate with no vehicle behind it answers 200 with success true and
 * every identity field empty, and rendered naively that reads as a clean car
 * with no finance and no write-off. reportPage must say "no vehicle found", not
 * draw an all-clear.
 *
 * server.js only calls .listen() when run directly, so requiring it here starts
 * no server and binds no port.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var app = require('../server.js');

var DIR = path.join(__dirname, 'fixtures');
function fixture(name) { return JSON.parse(fs.readFileSync(path.join(DIR, name), 'utf8')); }

var failed = 0;
function ok(label, pass, saw) {
  if (pass) { console.log('  pass  ' + label); return; }
  failed++;
  console.log('  FAIL  ' + label + (saw === undefined ? '' : '\n        saw: ' + String(saw).slice(0, 160)));
}

console.log('\nA plate with no vehicle behind it. This is the one that must never read as clean.');
var emptyPlate = fixture('oneauto-empty-plate.sample.json');
ok('the supplier answer carries no vehicle', app.vehicleIdentified(emptyPlate.result) === false);
var emptyHtml = app.reportPage('ZZ99ZZZ', emptyPlate);
ok('the report does not claim the vehicle is clear',
   emptyHtml.indexOf('Nothing recorded against this vehicle') === -1);
ok('the report says no vehicle was found', emptyHtml.indexOf('No vehicle found for this registration') !== -1);
ok('and it offers the refund rather than an all-clear', /refund/i.test(emptyHtml));

console.log('\nA real recorded answer, a vehicle with things against it.');
var real = fixture('oneauto-autocheck.sample.json');
ok('the supplier answer carries a vehicle', app.vehicleIdentified(real.result) === true);
var realHtml = app.reportPage('AB21ABC', real);
ok('outstanding finance is reported', realHtml.indexOf('Outstanding finance recorded') !== -1);
ok('the write-off is reported', /write-off/i.test(realHtml));
ok('the import marker is reported', /Imported vehicle/.test(realHtml));
ok('it is not drawn as an all-clear',
   realHtml.indexOf('Nothing recorded against this vehicle') === -1);
ok('the supplier brand never reaches the reader', !/\bHPI\b|AutoCheck|powered by Experian/i.test(realHtml));

console.log('');
if (failed) {
  console.log('history.test  ' + failed + ' failed.\n');
  process.exit(1);
}
console.log('history.test  every check passed, and no lookup was bought.\n');
process.exit(0);
