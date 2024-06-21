public class TriggerHandlerUtility {
    private static Boolean leadInsertProcessed = false;
 
    public static Boolean isLeadInsertProcessed() {
        return leadInsertProcessed;
    }
 
    public static void setLeadInsertProcessed(Boolean processed) {
        leadInsertProcessed = processed;
    }
}
 