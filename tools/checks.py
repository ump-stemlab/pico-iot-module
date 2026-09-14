# -*- coding: utf-8 -*-
"""The inline question gates — one per idea worth stopping for.

These replace the old "I can say why…" checkboxes, which a student could tick
in half a second whether or not they could. Each one is placed in the section
that has just taught the idea, and clearing it prints a layer of the robot part.

Shape matches the quiz: q, opts, right, why.
"""

CHECKS = {
0: {
 'lang': dict(
   q='Your program is written in <strong>MicroPython</strong>. What is it?',
   opts=['Python, trimmed down until it fits on a chip like the Pico',
         'A different language that only looks like Python',
         'A program on your computer that sends orders to the Pico'],
   right=0,
   why='Same language and the same rules &mdash; just small enough to live on a few hundred kilobytes.'),
 'err': dict(
   q='The Shell prints an error and gives you a <strong>line number</strong>. What do you do with it?',
   opts=['Look at that line, and then at the one above it',
         'Run the program again and hope',
         'Delete that line'],
   right=0,
   why='Python stops at the first thing it cannot make sense of &mdash; and a missing bracket or colon on the line <em>above</em> is what usually put it there.'),
},
1: {
 'pins': dict(
   q='The three LEDs are on <span class="gp">11</span>, <span class="gp">12</span> and <span class="gp">13</span>. Why must your program use those exact numbers?',
   opts=['That is where the board&rsquo;s own wiring joins each LED to the Pico',
         'Because MicroPython keeps those three numbers for lights',
         'Because they are the eleventh, twelfth and thirteenth parts on the board'],
   right=0,
   why='A GP number is a <em>wire</em>, not a name. Nothing is special about GP11 until the board joins it to LED1.'),
},
2: {
 'idea': dict(
   q='Take both of the waiting lines out and run it. What happens?',
   opts=['It still blinks &mdash; far too fast to see, so the LED just looks dim',
         'It blinks once and stops',
         'Nothing happens at all'],
   right=0,
   why='The loop runs millions of times a second. The wait is the only thing slowing it down to a speed your eye can follow.'),
 'indent': dict(
   q='A line is pushed in by four spaces. What does that tell Python?',
   opts=['This line is inside the loop, and repeats with it',
         'This line is a comment',
         'This line runs once, before the loop starts'],
   right=0,
   why='Indentation is how Python marks what belongs inside a block. Slide a line back to the left edge and it drops out of the loop.'),
},
3: {
 'pwm': dict(
   q='The Pico sends the servo fifty pulses a second whatever position you ask for. So what actually changes when the arm moves?',
   opts=['How long each pulse stays on',
         'How many pulses arrive each second',
         'How much voltage the pulses carry'],
   right=0,
   why='The rate stays at fifty a second. Only the <em>width</em> of each pulse changes, and the servo reads that width as an angle.'),
 'pin': dict(
   q='One hole on this board has three different numbers attached to it. Which number goes in your code?',
   opts=['The GP number',
         'The physical pin number counted along the edge',
         'The H1 connector number'],
   right=0,
   why='Code only ever speaks GP. The other two are for your fingers when you are working out where to plug something in.'),
},
4: {
 'idea': dict(
   q='What are you changing when you set a pin up as an <strong>input</strong> instead of an <strong>output</strong>?',
   opts=['Whether the Pico drives the pin, or listens to it',
         'Whether the pin carries 3.3&nbsp;V or 5&nbsp;V',
         'Whether the pin is on the left or the right of the board'],
   right=0,
   why='An output sends power out when you say so. An input sits quiet and lets you ask what is happening to it.'),
 'trap': dict(
   q='Nobody is touching SW1. What number does the pin give you?',
   opts=['1 &mdash; the pull-up is holding it high',
         '0 &mdash; nothing is happening',
         'Nothing at all until the button is pressed'],
   right=0,
   why='The built-in pull-up holds the pin at 3.3&nbsp;V, so an untouched button reads 1. Pressing it joins the pin to ground, and the answer drops to 0.'),
},
5: {
 'idea': dict(
   q='What does <strong>else</strong> give you that an <strong>if</strong> on its own does not?',
   opts=['A second road, taken whenever the question comes out false',
         'A second question to ask',
         'A way of repeating the if'],
   right=0,
   why='Without it, nothing ever switches the light back off &mdash; the program only has instructions for one of the two answers.'),
 'trap': dict(
   q='Which one belongs in an <strong>if</strong> line?',
   opts=['Two equals signs, because they ask a question',
         'One equals sign, because it compares',
         'Either one &mdash; Python treats them the same'],
   right=0,
   why='One equals sign <em>puts</em> a value into a name. Two <em>ask</em> whether two things match. An if is always asking.'),
},
6: {
 'tables': dict(
   q='Both buttons are held down at once. Which of the joining words answers <em>true</em>?',
   opts=['Both <strong>and</strong> and <strong>or</strong>',
         '<strong>and</strong> only',
         '<strong>or</strong> only'],
   right=0,
   why='<strong>or</strong> only needs one of them, so both is perfectly fine by it. <strong>and</strong> is the strict one &mdash; it is the word that needs both.'),
 'whole': dict(
   q='Why does the second half of the line need its own comparison, instead of just the pin&rsquo;s name?',
   opts=['Because <strong>and</strong> joins two complete questions, not two pin names',
         'Because the second button is on a different pin',
         'Because Python needs the number written twice to be sure'],
   right=0,
   why='Name the two pins on their own and Python reads each as &ldquo;there is something here&rdquo;, which is always true &mdash; so the light comes on and never goes out.'),
},
7: {
 'bus': dict(
   q='Eight parts can share the same two wires. What keeps their messages apart?',
   opts=['Every part has its own address, and ignores messages for the others',
         'Each part gets its own turn, one after another',
         'Each part uses a different voltage'],
   right=0,
   why='Every message carries an address. It is also why the sensor in Activity 8 can join these same two wires without needing any of its own.'),
 'lib': dict(
   q='The screen&rsquo;s library file has to be <em>on the Pico</em>, not just on your computer. Why?',
   opts=['The program runs on the board, so the file it wants has to be there too',
         'Thonny copies it across automatically every time',
         'It only matters in Wokwi'],
   right=0,
   why='That is exactly what <em>no module named</em> is telling you: the program is running on the board, and the file it is asking for is not on the board.'),
},
8: {
 'numbers': dict(
   q='A button gave you 1 or 0. This sensor gives you 0.9843137. Why the difference?',
   opts=['A button has two states; the sensor is measuring, and a measurement lands anywhere in between',
         'The sensor is faulty and needs calibrating',
         'MicroPython always uses decimals for sensors'],
   right=0,
   why='That is the whole jump this activity makes &mdash; from yes-or-no to how-much.'),
 'equals': dict(
   q='Why is &ldquo;is the tilt exactly 1.0?&rdquo; a bad question to ask a sensor?',
   opts=['It will almost never be exactly 1.0, so the answer is almost always no',
         '1.0 is outside the sensor&rsquo;s range',
         'MicroPython cannot compare decimals'],
   right=0,
   why='Measurements land <em>near</em> a number, not on it. Ask whether it is bigger or smaller than something and you get a question that can actually come true.'),
},
9: {
 'adc': dict(
   q='The probe gives a voltage, and your program reads a number between 0 and 65535. What has the ADC done?',
   opts=['Turned a voltage into a number the Pico can hold',
         'Turned a number into a voltage for the probe',
         'Made the signal stronger so it can be read'],
   right=0,
   why='A computer cannot hold a voltage. An ADC is the part that measures one and hands back a number standing for it.'),
 'probe': dict(
   q='You water the plant. Which way does the raw number go?',
   opts=['Down &mdash; wet soil carries electricity more easily',
         'Up &mdash; there is more water to measure',
         'Nowhere until the soil dries out again'],
   right=0,
   why='Wet soil conducts, which pulls the voltage at the probe down, and the number down with it. This is the one everybody gets backwards.'),
},
10: {
 'mqtt': dict(
   q='Your board never talks to the graph directly. What sits in between them?',
   opts=['A broker &mdash; the board publishes to it, and the dashboard reads from it',
         'A cable from the board to the web page',
         'The WiFi router'],
   right=0,
   why='Publisher on one side, subscriber on the other, and neither needs to know the other exists. Activity 11 turns the same arrangement round.'),
 'key': dict(
   q='Your Adafruit IO <strong>key</strong> is not your username. What is it?',
   opts=['A password &mdash; anybody who has it can write to your feeds',
         'The name of your feed',
         'The address of your dashboard'],
   right=0,
   why='Write it down privately, and keep it out of anything you show the class or put on a screen.'),
},
11: {
 'turn': dict(
   q='Activity 10 published a reading. What is your board doing today?',
   opts=['Subscribing &mdash; waiting to be told something',
         'Publishing, but faster',
         'Both at once, to the same feed'],
   right=0,
   why='The arrow turns round. The web page publishes what the switch did; the board subscribes, and acts on it.'),
 'callback': dict(
   q='You hand over the function&rsquo;s <em>name</em>, with no brackets after it. Why no brackets?',
   opts=['Brackets would run it now &mdash; the bare name hands it over to be run later',
         'Brackets are only for functions that take something in',
         'MicroPython does not allow brackets there'],
   right=0,
   why='Writing a function down does not run it. Put brackets on and you run it once, immediately, and hand over whatever it gave back &mdash; which is usually nothing at all.'),
},
12: {
 'noserver': dict(
   q='Today there is no broker and no WiFi. What does that cost you?',
   opts=['Nothing keeps the message &mdash; if nobody is listening at that moment, it is gone',
         'Messages travel more slowly',
         'Only one person can send at a time'],
   right=0,
   why='A broker held your reading until somebody came and asked for it. A radio wave waits for nobody.'),
 'mode': dict(
   q='M0, M1 and M2 all read <strong>1</strong> when your board wakes up. What is the radio doing?',
   opts=['Sleeping &mdash; nothing is sent and nothing arrives',
         'Sending at full power',
         'Waiting for you to give it a channel number'],
   right=0,
   why='Set the three mode pins before anything else. Miss them and the Shell just stays empty, with no error to tell you why.'),
},
13: {
 'yours': dict(
   q='Activities 10 and 11 used somebody else&rsquo;s middle. What is different today?',
   opts=['You build the middle &mdash; your own script, writing to your own sheet',
         'The board is faster',
         'The WiFi connection is more reliable'],
   right=0,
   why='Activity 10 borrowed a middle, Activity 12 took it away altogether, and today you build one.'),
 'json': dict(
   q='Your board sends a reading named <code>temp</code>. The script is looking for <code>temperature</code>. What happens?',
   opts=['That reading is quietly lost, and the column stays empty',
         'The script works out what you meant',
         'The board refuses to send anything'],
   right=0,
   why='Named readings only work if the name matches at <em>both</em> ends, exactly. Nothing warns you when it does not &mdash; which is why an empty column is the first thing to check.'),
},
}
