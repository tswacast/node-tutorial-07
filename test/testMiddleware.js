// testMiddleware.js

var middleware = require("../middleware");
var should = require("should");
var sinon = require("sinon");
var serverLogger = require("../serverLogger");

describe('Middleware', function(){
    describe('logRequests', function(){
        it('should log an info message', function(){
            
            // Stub call to serverLogger.info and save actual values
            var infoStub = sinon.stub(serverLogger, "info", function(){} );
            
            // Construct mock parameters
            var req = { method: null, url: null };
            var next = sinon.spy();
    
            // Execute the test
            middleware.logRequests(req, null, next);
    
            // Verify result
            infoStub.calledOnce.should.be.true;

            // Restore the stubbed functions            
            serverLogger.info.restore();
        });
        
        it('should include the request method in the log message', function(){
            
            // Expected values
            var expectedMethod = "GET";
            var expectedUrl = "/some/url/to/call";
            
            // Stub call to serverLogger.info and save actual values
            var actualMethod;
            var actualUrl;
            var infoStub = sinon.stub(serverLogger, "info", function(string, method, url){
                actualMethod = method;
                actualUrl = url;
            });
            
            // Construct mock parameters
            var req = { method: expectedMethod, url: expectedUrl };
            var next = sinon.spy();
    
            // Execute the test
            middleware.logRequests(req, null, next);
    
            // Verify result
            expectedMethod.should.equal(actualMethod, "The expected request method was not include in the log message.");

            // Restore the stubbed functions            
            serverLogger.info.restore();
        });
        
        it('should call next', function(){
            
            // Stub call to serverLogger.info and save actual values
            var infoStub = sinon.stub(serverLogger, "info", function(){} );
            
            // Construct mock parameters
            var req = { method: null, url: null };
            var next = sinon.spy();
    
            // Execute the test
            middleware.logRequests(req, null, next);
    
            // Verify result
            next.calledOnce.should.be.true;

            // Restore the stubbed functions            
            serverLogger.info.restore();
        });
    });
    
    describe('pageNotFound', function() {
        it ('should return a status of 404', function() {
            
            // Expected values
            var expectedStatus = 404;
            
            // Construct mock respons object
            var res = { render: function(){}, status: 0 };
            
            // Execute the test
            middleware.pageNotFound(null, res);
            
            // Verify result
            res.status.should.equal(expectedStatus, "The incorrect status was returned for page not found.");
        });
        
        it ('should render the 404 page', function() {
            // Expected results
            var page = "404";
            
            // Construct spy for response object
            var res = {render: sinon.spy()};
            
            // Execute the test
            middleware.pageNotFound(null, res);
            
            //Verify the result
            res.render.calledOnce.should.be.true;
            var spyCall = res.render.getCall(0);
            spyCall.calledWith(page).should.be.true;
            var dataObject = spyCall.args[1];
            should.exist(dataObject.title, "The data object passed to the page did not include a title property");
        });
    });
    
    describe('errorPage', function() {
        it('should log the error', function(){
            
            // Stub call to serverLogger.error
            var errorStub = sinon.stub(serverLogger, "error", function(){} );
            
            // Construct mock parameters
            var err = {};
            var res = { render: function(){}, status: 0 };
    
            // Execute the test
            middleware.errorPage(err, null, res);
    
            // Verify result
            errorStub.calledOnce.should.be.true;
            errorStub.getCall(0).calledWith(err).should.be.true;

            // Restore the stubbed functions            
            serverLogger.error.restore();
        });
        
        it ('should return a status of 500', function() {
            
            // Stub call to serverLogger.error
            sinon.stub(serverLogger, "error", function(){} );
            
            // Expected values
            var expectedStatus = 500;
            
            // Construct mock respons object
            var err = {};
            var res = { render: function(){}, status: 0 };
            
            // Execute the test
            middleware.errorPage(err, null, res);
            
            // Verify result
            res.status.should.equal(expectedStatus, "The incorrect status was returned for the error page.");
            
            // Restore the stubbed functions            
            serverLogger.error.restore();
        });
        
        it ('should render the error page', function() {
            // Stub call to serverLogger.error
            sinon.stub(serverLogger, "error", function(){} );

            // Expected results
            var page = "error";
            
            // Construct spy for response object
            var err = {};
            var res = {render: sinon.spy()};
            
            // Execute the test
            middleware.errorPage(err, null, res);
            
            //Verify the result
            res.render.calledOnce.should.be.true;
            var spyCall = res.render.getCall(0);
            spyCall.calledWith(page).should.be.true;
            var dataObject = spyCall.args[1];
            should.exist(dataObject.title, "The data object passed to the page did not include a title property");
            should.exist(dataObject.err, "The data object passed to the page did not include an err property");
            
            // Restore the stubbed functions            
            serverLogger.error.restore();
        });
    });
});