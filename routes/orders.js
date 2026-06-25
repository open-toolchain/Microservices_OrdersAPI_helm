/*eslint-env node */
/*globals cloudantService */
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

var USE_FASTCACHE = false;
var TEST_MODE = false;

// Initialize Cloudant client with IAM authentication
const authenticator = new IamAuthenticator({
    apikey: cloudantService.apikey || cloudantService.password
});

const cloudant = CloudantV1.newInstance({
    authenticator: authenticator,
    serviceUrl: cloudantService.url
});

// Initiate the database
(async () => {
    try {
        await cloudant.putDatabase({ db: 'orders' });
        console.log('Successfully created database!');
    } catch (err) {
        if (!TEST_MODE)
            console.log("Database already exists.");
    }
})();

// Helper object to maintain compatibility with old API
var ordersDb = {
    insert: async (doc, callback) => {
        try {
            const response = await cloudant.postDocument({
                db: 'orders',
                document: doc
            });
            if (callback) callback(null, response.result);
            return response.result;
        } catch (err) {
            if (callback) callback(err);
            throw err;
        }
    },
    get: async (id, options, callback) => {
        try {
            const response = await cloudant.getDocument({
                db: 'orders',
                docId: id
            });
            if (callback) callback(null, response.result);
            return response.result;
        } catch (err) {
            if (callback) callback(err);
            throw err;
        }
    },
    list: async (options, callback) => {
        try {
            const response = await cloudant.postAllDocs({
                db: 'orders',
                includeDocs: options.include_docs || false
            });
            if (callback) callback(null, response.result);
            return response.result;
        } catch (err) {
            if (callback) callback(err);
            throw err;
        }
    }
};

/* add an order to the database */
exports.create = function(req, res) {
	ordersDb.insert(req.body, function(err/*, body, header*/) {
		if (err){
			res.status(500).send({msg: 'Error on insert, maybe the item already exists: ' + err});
		} else {
			res.status(201).send({msg: 'Successfully created item'});
		}
	});
};
    

/* find an order by id */
exports.find = function(req, res) {
	var id = req.params.id;
    ordersDb.get(id, { revs_info: false }, function(err, body) {
        if (!err) {
            res.send(body);
        } else {
            res.send({msg:'Error: could not find item: ' + id});
        }
    });	
};

/* list all orders */
exports.list = function(req, res) {
	ordersDb.list({include_docs: true}, function(err, body/*, headers*/) {
  		if (err) {
    		// something went wrong!
			res.status(500).send({msg: "'list' failed: " + err});			
  		} else {
			var result = "";
			if (!body.rows) {
				result = "No orders logged";
			} else {
		    	body.rows.forEach(function(doc) {
		      		result += JSON.stringify(doc).toLocaleLowerCase() + "<p>";
		    	});
		    }
		    res.send(result);
  		}
	});
};

exports.getFastCache = function() {
    return USE_FASTCACHE;
};

exports.setTestMode = function(val) {
	TEST_MODE = val;
}