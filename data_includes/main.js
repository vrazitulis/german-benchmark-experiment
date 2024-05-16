PennController.ResetPrefix(null); // Shorten command names (keep this line here))

Header(
// void
)
.log( "PROLIFIC_ID" , GetURLParameter("PROLIFIC_PID") )
.log( "STUDY_ID" , GetURLParameter("STUDY_ID") )
.log( "SESSION_ID" , GetURLParameter("SESSION_ID") )

DebugOff() // Uncomment this line only when you are 100% done designing your experiment


// Custom function

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

Sequence("counter", "consent", "instructions", "practice", "transition", sepWithN("break", randomize("experimental-trial"), 42), "questionnaire", "send", "confirmation-prolific")

SetCounter("counter", "inc", 1);


// This message is shown to everyone with a screen resolution under 1280px
newTrial("ScreenSizeChecker",
    newFunction( ()=>window.matchMedia("only screen and (max-width: 899px)").matches )
        .test.is(true)
        .success( 
            newText("<p>Leider ist Ihre Bildschirmauflösung zu klein.</p>"+
                    "<p>Bitte erhöhen Sie Ihre Bildschirmauflösung oder probieren Sie es an einem anderen PC.</p>")
                .print()
            ,
            newButton().wait() 
        )
);

// Fullscreen from beginning on
PennController("Fullscreen",
  newHtml("fullscreen", "fullscreen.html")
  .print(),
  newButton("Zum Vollbildmodus")
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
        .checkboxWarning("Sie müssen zustimmen, bevor Sie fortfahren..")
        .print()
    ,
    newButton("continue", "Klicken, um fortzufahren")
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
    newButton("continue", "Klicken, um fortzufahren")
        .center()
        .css("font-size", "medium")
        .print()
        .wait()
)



newTrial("questionnaire",
    newController("Question", {
            q: "Ist Deutsch Ihre Muttersprache?",
            as: ["Ja", "Nein"],
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
            q: "Leben Sie aktuell in einem deutschsprachigen Land?",
            as: ["Ja", "Nein"],
            hasCorrect: true,
            randomOrder: false})
        .center()
        .print()
        .log()
        .wait()
        .remove()
)


newTrial("practice",
    newController("DashedSentence", {s : "In_der_Bibliothek liest die_Studentin ein_Buch über_Astronomie."})
        .css("white-space","nowrap")
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,

    newController("Question", {
            instructions: "Benutzen Sie die Zifferntasten oder klicken Sie auf eine Antwort.",
            q:  "Was liest die Studentin?",
            as: ["Ein Buch.", "Eine Zeitschrift."].sort(v=>0.5-Math.random()).concat(["Ich weiß es nicht."]), // first is correct
            hasCorrect: true,
            randomOrder: false})
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,

    newController("DashedSentence", {s : "Der_Autor, der seit_Jahren an_seinem_Roman schreibt, wird bald endlich das_letzte_Kapitel beenden."})
        .css("white-space","nowrap")
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,

    newController("Question", {
            instructions: "Benutzen Sie die Zifferntasten oder klicken Sie auf eine Antwort.",
            q:  "Wie lange schreibt der Autor bereits an seinem Roman?",
            as: ["Seit Monaten.", "Seit Jahren."].sort(v=>0.5-Math.random()).concat(["Ich weiß es nicht."]), // second is correct
            hasCorrect: true,
            randomOrder: false})
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,
      
    newController("DashedSentence", {s : "Die_Lehrerin organisierte einen_Schulausflug, damit die_Kinder das_Museum besuchen_konnten."})
        .css("white-space","nowrap")
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,
    
    newController("Question", {
            instructions: "Benutzen Sie die Zifferntasten oder klicken Sie auf eine Antwort.",
            q:  "Wohin ging der Schulausflug?",
            as: ["Ins den Zoo.", "Ins Museum."].sort(v=>0.5-Math.random()).concat(["Ich weiß es nicht."]), // second is correct
            hasCorrect: true,
            randomOrder: false})
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,

    newController("DashedSentence", {s : "Am_Wochenende fahren die_Freunde in_die_Berge zum_Wandern und genießen dabei die_frische_Luft und die_Aussicht."})
        .css("white-space","nowrap")
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,
    
    newController("Question", {
            instructions: "Benutzen Sie die Zifferntasten oder klicken Sie auf eine Antwort.",
            q:  "Wohin fahren die Freunde?",
            as: ["In die Berge.", "Ans Meer."].sort(v=>0.5-Math.random()).concat(["Ich weiß es nicht."]), // first is correct
            hasCorrect: true,
            randomOrder: false})
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,

    newController("DashedSentence", {s : "Die_kleine_Katze schläft den_ganzen_Tag im_sonnigen_Garten, während die_Kinder Fußball spielen."})
        .css("white-space","nowrap")
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,
    
    newController("Question", {
            instructions: "Benutzen Sie die Zifferntasten oder klicken Sie auf eine Antwort.",
            q:  "Ist die kleine Katze den ganzen Tag wach?",
            as: ["Ja.", "Nein."].sort(v=>0.5-Math.random()).concat(["Ich weiß es nicht."]), // second is correct
            hasCorrect: true,
            randomOrder: false})
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,

    newController("DashedSentence", {s : "Der_Lehrer erklärt die_neuen_Grammatikregeln, indem er verschiedene_Beispiele an_der_Tafel vorführt."})
        .css("white-space","nowrap")
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,
    
    newController("Question", {
            instructions: "Benutzen Sie die Zifferntasten oder klicken Sie auf eine Antwort.",
            q:  "Was erklärt der Lehrer?",
            as: ["Grammatikregeln.", "Tonarten."].sort(v=>0.5-Math.random()).concat(["Ich weiß es nicht."]), // first is correct
            hasCorrect: true,
            randomOrder: false})
        .center()
        .print()
        .log()
        .wait()
        .remove()
    )


// Transition
    newTrial("transition",
     // Automatically print all Text elements, centered
    defaultText.center().print()
    ,
    newHtml("transition", "transition.html")
        .cssContainer({"width":"700px"})
        .print()
    ,
    newButton("continue", "Klicken, um fortzufahren")
        .center()
        .css("font-size", "medium")
        .print()
        .wait()
)


newTrial("break",
     // Automatically print all Text elements, centered
    newText("pleasewait", "<span style='font-size:20px;'>Machen Sie eine kurze Pause! Es geht gleich weiter.</span>")
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
    newText("resume", "<span style='font-size:20px;'>Sie können mit dem Experiment jetzt fortfahren.<br><br></span>")
    .print()
    .center()
    ,
    newButton("continue", "Klicken, um fortzufahren")
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
            instructions: "Benutzen Sie die Zifferntasten oder klicken Sie auf eine Antwort.",
            q: row.question,
            as: [row.option_1, row.option_2].sort(v=>0.5-Math.random()).concat(["Ich weiß es nicht."]),
            hasCorrect: true,
            randomOrder: false })
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
    newText("<p>Danke für Ihre Teilnahme!</p>")
        .center()
        .print()
    ,
 // This is where you should put the link from the last step.
    newText("<p><a href='https://app.prolific.co/submissions/complete?cc=C1A7Z6LC'>Klicken Sie hier, um Ihre Teilnahme zu validieren.</a></p>")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
    ).setOption("countsForProgressBar",false)

