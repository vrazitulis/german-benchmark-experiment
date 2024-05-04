PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen

Sequence("counter", "consent", "instructions", randomize("experimental-trial"), "questionnaire", "send", "confirmation-prolific")

// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("ID").global()    
)
.log( "id" , getVar("ID") ) // Add the ID to all trials' results lines

SetCounter("counter", "inc", 1);

// This message is shown to everyone with a screen resolution under 1280px
newTrial("ScreenSizeChecker",
    newFunction( ()=>window.matchMedia("only screen and (max-width: 899px)").matches )
        .test.is(true)
        .success( 
            newText("<p>Unfortunately, your display resolution is too low.</p>"+
                    "<p>Please try to change your resolution or use another computer/display.</p>")
                .print()
            ,
            newButton().wait() 
        )
);

// Fullscreen from beginning on
PennController("Fullscreen",
  newHtml("fullscreen", "fullscreen.html")
  .print(),
  newButton("Go full screen")
    .css("font-size", "medium")
    .center()
    .print()
    .wait()
    ,
    fullscreen()
);


// Consent form
newTrial("consent",
    newHtml("consent_form", "consent.html")
        .cssContainer({"width":"700px"})
        .checkboxWarning("You must consent before continuing.")
        .print()
    ,
    newButton("continue", "Click to continue")
        .center()
        .css("font-size", "medium")
        .print()
        .wait(getHtml("consent_form").test.complete()
                  .failure(getHtml("consent_form").warn())
        )
)

// Instructions
newTrial("instructions",
     // Automatically print all Text elements, centered
    defaultText.center().print()
    ,
    newHtml("instructions", "instr.html")
        .cssContainer({"width":"700px"})
        .print()
    ,
    newText("Please type in your ID below.")
        .css("font-size", "medium")
    ,
    newTextInput("inputID", "")
        .center()
        .css("margin","1em")    // Add a 1em margin around this element
        .print()
    ,
    newButton("Start")
        .css("font-size", "medium")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    getVar("ID").set( getTextInput("inputID") )
)



newTrial("questionnaire",
    newController("Question", {
            q: "Are you a native speaker of English?",
            as: ["Yes", "No"],
            hasCorrect: true,
            randomOrder: false})
        .center()
        .print()
        .log()
        .wait()
        .remove()
)


newTrial("questionnaire",
    newController("Question", {
            q: "Are you currently living in an English-speaking country?",
            as: ["Yes", "No"],
            hasCorrect: true,
            randomOrder: false})
        .center()
        .print()
        .log()
        .wait()
        .remove()
)


// Experimental trial
Template("benchmark_items.csv", row =>
    newTrial("experimental-trial",
        newController("DashedSentence", {s : row.sentence})
        .css("white-space","nowrap")
        .center()
        .print()
        .log()
        .wait()
        .remove()
        ,
        newController("Question", {
            instructions: "Use number keys or click on the answer.",
            q: row.question,
            as: [row.option_1, row.option_2],
            hasCorrect: true,
            randomOrder: false})
        .center()
        .print()
        .log()
        .wait()
        .remove()
    )
    .log("id", row.id)
    .log("item", row.item)
    .log("condition", row.condition)
    // TODO more logging
)


// Send results manually
SendResults("send")

// Completion screen
newTrial("confirmation-prolific" ,
    newText("<p>Thank you for your participation!</p>")
        .center()
        .print()
    ,
 // This is where you should put the link from the last step.
    newText("<p><a href='https://app.prolific.co/submissions/complete?cc=C1A7Z6LC'>Click here to validate your submission</a></p>")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
    ).setOption("countsForProgressBar",false)
