//Library for storing and editing data


// Dependencies

const fs = require('fs');
const path = require('path');

// Container for the module (to be exported)
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname,'../.data/');

// Write data to a file
lib.create = function (dir,file,data,callback){
    // Open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json','wx',function (err,fileDescriptor){
        if (!err && fileDescriptor){
            // Convert data to a string
            var stringData = JSON.stringify(data);

            // Write to a file and close it
            fs.writeFile(fileDescriptor,stringData,function (err){
                if (!err){
                    fs.close(fileDescriptor,function (err){
                        if (!err){
                            callback(false);
                        }else{
                            callback("Error closing new file");
                        }
                    })
                }else{
                    callback("Error writing to new file");
                }
            })
        }else{
            callback('Could not create new file, it may already exist');
        }
    });

}

// Read data from a file
lib.read = function (dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function (err,data){
        callback(err,data)
    })
}

// Update data inside a file
lib.update = function (dir,file,data,callback){

    // Open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json','r+',function (err,fileDescriptor) {
        if (!err && fileDescriptor) {

            // Convert the data to string
            var stringData = JSON.stringify(data)

            // Truncate the file
            fs.ftruncate(fileDescriptor,function(err){
                if(!err){
                    // Write data to the file and close it
                    fs.writeFile(fileDescriptor,stringData, function (err){
                        if(!err){
                            fs.close(fileDescriptor, function (err){
                                if(!err){
                                    callback(false)
                                }else{
                                    callback("Error closing the file")
                                }
                            });
                        }else{
                            callback("Error writing to existing file")
                        }
                    })

                }else{
                   callback("Error truncating file")
                }
            })
        }else{
            callback('could not open the file for updating, it may not exist yet')
        }
    })
}

// Delete a file
lib.delete = function (dir,file,callback){
    // Unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function (err){
        if(!err){
              callback(false)
        }else{
            callback("Error deleting file, it may not exist")
        }
    })
}


// Export the module
module.exports  = lib;