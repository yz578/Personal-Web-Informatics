// Database
var db = (function(){
    var initDatabase = function() {
        try {
            if (!window.openDatabase) {
                alert('Local databases are not supported by your browser. ');
            } else {
                var shortName = 'web_informatics_data';
                var version = '1.0';
                var displayName = 'Web Informatics Data';
                var maxSize = 1000000; // in bytes
                DB = openDatabase(shortName, version, displayName, maxSize);
                createTables();
            }
        } catch(e) {
            if (e == 2) {
                // Version mismatch.
                console.log("Invalid database version.");
            } else {
                console.log("Unknown error "+ e +".");
            }
            return;
        } 
    };

    var createTables = function (){
        DB.transaction(
            function (transaction) {
                transaction.executeSql(
                    ('CREATE TABLE IF NOT EXISTS history(date TEXT NOT NULL PRIMARY KEY, url TEXT NOT NULL);'),
                     [], nullDataHandler, errorHandler
                );
            }
        );
    };

    var nullDataHandler = function (){
        console.log("SQL Query Succeeded");
    };

    var errorHandler = function (transaction, error){
        if (error.code==1){
            // DB Table already exists
        } else {
            // Error is a human-readable string.
            console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
        }
        return false;
    };

    var selectAll = function (){ 
        DB.transaction(
            function (transaction) {
                transaction.executeSql("SELECT * FROM history;", 
                    [], dataSelectHandler, errorHandler);
            }
        );  
    };

    var dataSelectHandler = function (transaction, results){
        for (var i = 0, len = results.rows.length; i < len ; i++) {
            var row = results.rows.item(i);
            var item  = new Object();
            item.date = row['date'];
            item.url  = row['url'];
            console.log(item);
        }
    };

    var insert = function (date, url){
        DB.transaction(
            function (transaction) {
                transaction.executeSql("INSERT INTO history(date, url) VALUES (?, ?)", [date, url]);
            }
        );  
    };

    return{
        initDatabase : initDatabase,
        insert       : insert,
        selectAll    : selectAll
    }
})();

db.initDatabase();
db.insert(new Date(), 'http://www.example.com');
db.selectAll();