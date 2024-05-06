// TODO in different places: translate instruction snippets to German etc., adapt them

PennController.ResetPrefix(null); // Shorten command names (keep this line here))

Header(
// void
)
.log( "PROLIFIC_ID" , GetURLParameter("PROLIFIC_PID") )
.log( "STUDY_ID" , GetURLParameter("STUDY_ID") )
.log( "SESSION_ID" , GetURLParameter("SESSION_ID") )

DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// custom function

function SepWithN(sep, main, n) {
    this.args = [sep,main];

    this.run = function(arrays) {
        assert(arrays.length == 2, "Wrong number of arguments (or bad argument) to SepWithN");
        assert(parseInt(n) > 0, "N must be a positive number");
        let sep = arrays[0];
        let main = arrays[1];

        if (main.length <= 1)
            return main
        else {
            let newArray = [];
            while (main.length){
                for (let i = 0; i < n && main.length>0; i++)
                    newArray.push(main.shift());
                for (let j = 0; j < sep.length; ++j)
                    newArray.push(sep[j]);
            }
            return newArray;
        }
    }
}
function sepWithN(sep, main, n) { return new SepWithN(sep, main, n); }


// First show instructions, then experiment trials, send results and show end screen

Sequence("counter", "consent", "instructions", sepWithN("break", randomize("experimental-trial"), 42), "questionnaire", "send", "confirmation-prolific")

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
    newButton("continue", "Click to continue")
        .center()
        .css("font-size", "medium")
        .print()
        .wait()
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


// TODO: add practice trials

newTrial("break",
     // Automatically print all Text elements, centered
    newText("pleasewait", "<span style='font-size:20px;'>Take a breather!</span>")
    .print()
    .center()
    ,
    newTimer("wait", 10000)
    .start()
    .wait()
    ,
    getText("pleasewait")
    .remove()
    ,
    newText("resume", "<span style='font-size:20px;'>You can now resume the study. Press continue to resume. <br> <br></span>")
    .print()
    .center()
    ,
    newButton("continue", "Click to continue")
        .center()
        .css("font-size", "medium")
        .print()
        .wait()
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
    .log("group", row.group)
    .log("phenomenon", row.phenomenon)
    .log("condition", row.condition)
    .log("condition_name", row.condition_name)
    .log("critical_index", row.critical_index)
    .log("exp_answer", row.exp_answer)
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
