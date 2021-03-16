
const ENS = require('ethereum-ens');
const Web3 = require('web3');
const path = require('path');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const DIR_TO_PROCESS = './ens_to_process/';
const DIR_PROCESSED = './ens_processed/';
const DIR_REPORTS = './reports/';

const provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/64710aa339dd43fc914401096179922d");
const ens = new ENS(provider);

/**
 * Checks if ens' in json are available or taken
 * Generate report for file parsing in /reports directory
 * Move the json file to /ens_processed directory
 *
 * @param {string} file
 */
const processFile = async (file) => {
	try {
		const date = Date.now();
		const csvWriter = createCsvWriter({
			path: path.join(DIR_REPORTS, `${date}_` + file + '.csv'),
			header: [
				{id: 'name', title: 'Name'},
				{id: 'status', title: 'Status'}
			]
		});

		const content = fs.readFileSync(path.join(DIR_TO_PROCESS, file), 'utf8');
		const data = JSON.parse(content);

		for (const item of data) {
			if (item.name && item.name != '') {
				const csvContent = {};
				csvContent.name = item.name + '.eth';

				try {
					const res = await ens.resolver(csvContent.name).addr();
					if (res) {
						csvContent.status = 'Taken';
						csvWriter.writeRecords([csvContent]).then(()=> {});
					}
				} catch (error) {
					csvContent.status = 'Available';
					csvWriter.writeRecords([csvContent]).then(()=> {});
				}
				console.log(csvContent.name + ":\t" + csvContent.status);
			}
		}

		// Move file to processed
		await renameFile(
			file,
			path.join(DIR_TO_PROCESS, file),
			path.join(DIR_PROCESSED, `${date}_` + file)
		);

	} catch (error) {
		console.error(`ERROR: Failed to Parse File ${file}!`, error.message);
	}
}

const renameFile = (file, from, to) => {
  	return new Promise((resolve, reject) => {
		fs.rename(from, to, (err) => {
			if (err) {
				reject(err)
			} else {
				console.log(`File ${file} Moved to ${DIR_PROCESSED}!\n\n`);
				resolve()
			}
		})
	})
}

const run = async () => {
	const files = fs.readdirSync(DIR_TO_PROCESS);
	console.info('\n################ Job Started! ################\n');
	console.info(`Files to process: ${files.length}`);
	console.info(`Reading files from: ${DIR_TO_PROCESS}\n`);
	for (const file of files) {
		if (path.extname(file) != '.json') {
			console.info(`Skipping FILE: ${file}. File not JSON.\n`);
			continue;
		}
		console.info(`Processing FILE: ${file}...`);
		await processFile(file);
	}
	console.info(`Reports Generated at: ${DIR_REPORTS}\n`);
	console.info('################ Job Ended! ################');
}

// Script execution starts here
run();