public class LeadAPIIntegration {

    // Method to send lead information to an external API
    public static void sendLeadInformation(String leadId) {
        // Retrieve lead information
        Lead leadRecord = [SELECT Id, FirstName, LastName, Email, Company
                           FROM Lead
                           WHERE Id = :leadId
                           LIMIT 1];

        // Create a JSON object with lead information
        Map<String, Object> leadJson = new Map<String, Object>{
            'id' => leadRecord.Id,
            'firstName' => leadRecord.FirstName,
            'lastName' => leadRecord.LastName,
            'email' => leadRecord.Email,
            'company' => leadRecord.Company
        };

        // Convert JSON object to string
        String leadJsonString = JSON.serialize(leadJson);

        // Define the endpoint URL of the external API
        String endpointUrl = 'https://example.com/api/lead';

        // Create HTTP request
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpointUrl);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');
        request.setBody(leadJsonString);

        // Send HTTP request
        Http http = new Http();
        HttpResponse response = http.send(request);

        // Check the response status
        if (response.getStatusCode() == 200) {
            System.debug('Lead information sent successfully');
        } else {
            System.debug('Failed to send lead information. Status code: ' + response.getStatusCode());
        }
    }
}
