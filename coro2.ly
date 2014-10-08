%=============================================
%   created by MuseScore Version: 1.3
%          October 2, 2014
%=============================================

\version "2.12.0"



#(set-default-paper-size "a4")

\paper {
  line-width    = 190\mm
  left-margin   = 10\mm
  top-margin    = 10\mm
  bottom-margin = 20\mm
  %%indent = 0 \mm 
  %%set to ##t if your score is less than one page: 
  ragged-last-bottom = ##t 
  ragged-bottom = ##f  
  %% in orchestral scores you probably want the two bold slashes 
  %% separating the systems: so uncomment the following line: 
  %% system-separator-markup = \slashSeparator 
  }

\header {
title = ""
}

AvoiceAA = \relative c{
\compressFullBarRests
\mergeDifferentlyDottedOn
\mergeDifferentlyHeadedOn
    \set Staff.instrumentName = #""
    \set Staff.shortInstrumentName = #""
    %staffkeysig
    \key f \major 
    %barkeysig: 
    \key f \major 
    %bartimesig: 
    \time 4/2 
    R\breve*13      | % 1
    %R      | % 2
    %R      | % 3
    %R      | % 4
    %R      | % 5
    %R      | % 6
    %R      | % 7
    %R      | % 8
    %R      | % 9
    %R      | % 10
    %R      | % 11
    %R      | % 12
    %R      | % 13
    r2 d''1 d2      | % 14
    e f1 d2      | % 15
    d1. d2      | % 16
    cis\breve      | % 17
    r1 r2 d      | % 18
    d d e1      | % 19
    f2 f1 e2      | % 20
    f1 r      | % 21
    r2 f2. f4 e2      | % 22
    d2. e4 cis2 d~      | % 23
    d cis d1~      | % 24
    d2 d d1      | % 25
    r2 g,1 g2      | % 26
    c2. ais4 a g f e      | % 27
    d2. e4 f g a ais      | % 28
    c d e f g d g2~      | % 29
    g fis g1~      | % 30
    g e      | % 31
    r\breve      | % 32
    r      | % 33
    r1 r2 d~      | % 34
    d e f2. f4      | % 35
    d2 e1 d2~      | % 36
    d cis d1~      | % 37
    d r2 d~      | % 38
    d4 d g2 e1~      | % 39
    e r2 f~      | % 40
    f4 f f2 f2. e4      | % 41
    d e f g a2 f~      | % 42
    f4 dis c2 d f~      | % 43
    f f d dis~      | % 44
    dis4 d d1 c2      | % 45
    d d c4 ais a a      | % 46
    g1 r      | % 47
    r2 d' dis2. dis4      | % 48
    d1 r      | % 49
    r2 d c ais      | % 50
    r d c ais      | % 51
    f'2. f4 e2 e      | % 52
    d1 d      | % 53
    r2 d cis f      | % 54
    e4 d e2 fis1      | % 55
    r\breve      | % 56
    r      | % 57
    fis1 fis2 fis      | % 58
    g1 a~      | % 59
    a r4 d,4. d8 d4      | % 60
    b1 r      | % 61
    r4 c4. c8 c4 a2 ais~      | % 62
    ais a ais1      | % 63
    r2 g'2. g4 g2      | % 64
    f f f1      | % 65
    r r2 c      | % 66
    ais4. ais8 a4 a g2 a      | % 67
    r1 r2 f'~      | % 68
    f4 f f2 d2. e4      | % 69
    f2 f1 d2      | % 70
    r r4 cis d2 cis      | % 71
    r1 a4 a d4. c8      | % 72
    ais2 g4 g c4. ais8 a2      | % 73
    f4 f ais4. a8 g1~      | % 74
    g2 g4 g c4. ais8 a2      | % 75
    a1 a      | % 76
    r2 d2. c4 ais2      | % 77
    a d d4 c ais a      | % 78
    g2 d' dis d      | % 79
    c2. d4 dis2 c      | % 80
    b\breve \bar "|." 
}% end of last bar in partorvoice

 

AvoiceBA = \relative c{
\compressFullBarRests
    \set Staff.instrumentName = #""
    \set Staff.shortInstrumentName = #""
    %staffkeysig
    \key f \major 
    %barkeysig: 
    \key f \major 
    %bartimesig: 
    \time 4/2 
    R\breve *13     | % 1
    %R      | % 2
    %R      | % 3
    %R      | % 4
    %R      | % 5
    %R      | % 6
    %R      | % 7
    %R      | % 8
    %R      | % 9
    %R      | % 10
    %R      | % 11
    %R      | % 12
    %R      | % 13
    b''1. b2      | % 14
    c c1 ais2~      | % 15
    ais4 a a1 g2      | % 16
    a1 r2 a      | % 17
    a a b1~      | % 18
    b2 b c c~      | % 19
    c ais c1      | % 20
    a c2. c4      | % 21
    ais2 a1 g2      | % 22
    fis g2. g4 f2      | % 23
    e1 d2 ais'      | % 24
    a1 b      | % 25
    c1. c2      | % 26
    c c, f1~      | % 27
    f2 f f c~      | % 28
    c g'1 g2      | % 29
    a d, g2. a4      | % 30
    b c d2 c1      | % 31
    r\breve      | % 32
    r      | % 33
    r1 b~      | % 34
    b2 c c2. c4      | % 35
    ais2. ais4 a1      | % 36
    a a~      | % 37
    a r2 d,~      | % 38
    d4 d d2 c1      | % 39
    c' r2 c~      | % 40
    c4 c c2 ais1      | % 41
    f1. ais2      | % 42
    c f, f ais~      | % 43
    ais a g1      | % 44
    g g      | % 45
    a2 ais a4 g g fis      | % 46
    g1 r      | % 47
    r2 ais c2. c4      | % 48
    f,1 r      | % 49
    r2 ais a ais      | % 50
    r ais a ais      | % 51
    c2. c4 c2 c      | % 52
    d g, a1      | % 53
    a r2 a      | % 54
    e4 a a2 fis1      | % 55
    r\breve      | % 56
    r      | % 57
    r1 d'      | % 58
    d2 d f1      | % 59
    e r4 a,4. a8 a4      | % 60
    g1 r      | % 61
    r4 g4. g8 g4 f1      | % 62
    f f2 g~      | % 63
    g4 g ais2 g2. a4      | % 64
    ais c d e f2 c      | % 65
    r1 r2 a      | % 66
    f4 g e f e2 f      | % 67
    r1 r2 c'~      | % 68
    c4 c c2 f, g      | % 69
    f4 g a1 g2      | % 70
    a4 e a1 a2      | % 71
    r r4 a a d4. c8 ais4~      | % 72
    ais ais c2 r a4 a      | % 73
    ais4. c8 d4 g, g1      | % 74
    e r      | % 75
    r2 a2. g4 f2      | % 76
    d1. d'2      | % 77
    d2. c4 ais a g2      | % 78
    d'1 r2 g,~      | % 79
    g g g1      | % 80
    g\breve \bar "|." 
}% end of last bar in partorvoice

 

AvoiceCA = \relative c{
\compressFullBarRests
    \set Staff.instrumentName = #""
    \set Staff.shortInstrumentName = #""
    %staffkeysig
    \key f \major 
    %barkeysig: 
    \key f \major 
    %bartimesig: 
    \time 4/2 
    R\breve *13     | % 1
    %R      | % 2
    %R      | % 3
    %R      | % 4
    %R      | % 5
    %R      | % 6
    %R      | % 7
    %R      | % 8
    %R      | % 9
    %R      | % 10
    %R      | % 11
    %R      | % 12
    %R      | % 13
    g''1. g2      | % 14
    g a1 g2      | % 15
    f1. e4 d      | % 16
    e2 e e e      | % 17
    fis1 g2. f8 e      | % 18
    d2 g2. e4 a2~      | % 19
    a g4 f g1      | % 20
    f2 a2. a4 g2      | % 21
    f1 r2 c'~      | % 22
    c4 c ais2 a1~      | % 23
    a2 a fis g~      | % 24
    g fis g g~      | % 25
    g g g4 f e d      | % 26
    c2 c' d a      | % 27
    ais1 a2 f      | % 28
    g2. a4 ais c d2~      | % 29
    d a b c      | % 30
    d g, g1      | % 31
    r\breve      | % 32
    r      | % 33
    r1 g~      | % 34
    g2 g a1      | % 35
    g2. g4 f2. f4      | % 36
    e1 d~      | % 37
    d r2 g~      | % 38
    g4 g g2 g1~      | % 39
    g r2 a~      | % 40
    a4 a a2 f1~      | % 41
    f2 ais c f,      | % 42
    f2. dis4 d2 d'~      | % 43
    d c b c~      | % 44
    c ais1 a4 g      | % 45
    fis2 g e4 d e d      | % 46
    d1 r      | % 47
    r2 g g g      | % 48
    ais1 r      | % 49
    r2 f f f      | % 50
    r f f f      | % 51
    r c2. c4 g'2      | % 52
    g d f1      | % 53
    e2 d a'1~      | % 54
    a a      | % 55
    r\breve      | % 56
    r      | % 57
    a1 a2 a      | % 58
    d\breve      | % 59
    cis1 r4 d4. d8 d,4      | % 60
    g1 r      | % 61
    r4 c4. c8 c,4 c2 d      | % 62
    c1 d2 ais'~      | % 63
    ais4 ais g2. a4 ais c      | % 64
    d2 ais c1      | % 65
    r r2 f,      | % 66
    d4 d c c c2 r      | % 67
    r1 r2 c~      | % 68
    c4 c f2. d4 d2~      | % 69
    d4 e f2. d4 d2      | % 70
    e2. e4 f2 e      | % 71
    r e4 e f4. e8 d2      | % 72
    d r e4 e f2      | % 73
    f r4 g2 c,4 d2      | % 74
    e4 g4. f8 e2 a f4      | % 75
    e d e2 d a'      | % 76
    ais2. g4 a2 d,      | % 77
    r d1 d2      | % 78
    g1 r2 g      | % 79
    c c, g'1~      | % 80
    g2 d d1 \bar "|." 
}% end of last bar in partorvoice

 

AvoiceDA = \relative c{
\compressFullBarRests
    \set Staff.instrumentName = #""
    \set Staff.shortInstrumentName = #""
    \clef bass
    %staffkeysig
    \key f \major 
    \clef bass
    %barkeysig: 
    \key f \major 
    %bartimesig: 
    \time 4/2 
    R\breve*13      | % 1
   % R      | % 2
   % R      | % 3
   % R      | % 4
   % R      | % 5
   % R      | % 6
   % R      | % 7
   % R      | % 8
   % R      | % 9
   % R      | % 10
   % R      | % 11
   % R      | % 12
   % R      | % 13
    g1. g2      | % 14
    c f1 g2      | % 15
    d2. c4 ais1      | % 16
    a2 a a a      | % 17
    d1 g,      | % 18
    g2 g c2. a4      | % 19
    d1 c      | % 20
    f,2 f'2. f4 e2      | % 21
    d1 c      | % 22
    d2 g, a1      | % 23
    a d~      | % 24
    d g,      | % 25
    c1. c2      | % 26
    a1 d2. c4      | % 27
    ais1 f      | % 28
    c'2. ais8 a g2 g      | % 29
    d'1 g,~      | % 30
    g c      | % 31
    r\breve      | % 32
    r      | % 33
    r1 g~      | % 34
    g2 c f,4 g a f      | % 35
    g2. g4 a1~      | % 36
    a d~      | % 37
    d r2 g,~      | % 38
    g4 g g2 c1~      | % 39
    c r2 f,~      | % 40
    f4 f f2 ais1~      | % 41
    ais2 ais a ais      | % 42
    f1 ais2 ais~      | % 43
    ais f' g c,~      | % 44
    c d dis1      | % 45
    d2 g, a4 ais c d      | % 46
    g,1 r      | % 47
    r2 g c2. c4      | % 48
    ais1 r      | % 49
    r2 ais f' ais,      | % 50
    r ais f' ais,      | % 51
    f2. f4 c'2 c      | % 52
    g1 d'      | % 53
    a\breve~      | % 54
    a1 d      | % 55
    r\breve      | % 56
    r      | % 57
    d1 d2 d      | % 58
    ais'1 a~      | % 59
    a r4 d,4. d8 d4      | % 60
    g,1 r      | % 61
    r4 c4. c8 c4 f,1      | % 62
    f ais2 dis~      | % 63
    dis4 dis dis2 dis1      | % 64
    ais2 ais f1      | % 65
    r r2 f      | % 66
    ais4. g8 a4 f c'2 f,      | % 67
    r1 r2 f~      | % 68
    f4 f f2 ais g      | % 69
    d'2. c4 ais1      | % 70
    a2. a4 d2 a      | % 71
    r a4 a d4. c8 ais2      | % 72
    g4 g c4. ais8 a2 f4 f      | % 73
    ais4. a8 g2 c g      | % 74
    c c4. ais8 a2 d      | % 75
    a1 d2. c4      | % 76
    ais2 g fis g      | % 77
    d'1 g,2 g~      | % 78
    g g c b      | % 79
    c\breve      | % 80
    g \bar "|." 
}% end of last bar in partorvoice


\score { 
    << 
      %  \context StaffGroup = B<< 
      %      \context Staff = ApartA << 
      %          \context Voice = AvoiceAA \AvoiceAA
      %      >>


      %      \context Staff = ApartB << 
      %          \context Voice = AvoiceBA \AvoiceBA
      %      >>


      %      \context Staff = ApartC << 
      %          \context Voice = AvoiceCA \AvoiceCA
      %      >>


      %      \context Staff = ApartD << 
      %          \context Voice = AvoiceDA \AvoiceDA
      %      >>


      %  >> %end of StaffGroupB
    \new PianoStaff <<
      \new Staff <<
        \clef treble
        \partcombine
        \new Voice = "1" { \voiceOne  \AvoiceAA }
        \new Voice = "3" {\voiceThree  \AvoiceBA } 
        \new Voice = "2" { \voiceTwo \AvoiceCA } 
      >>
      \new Staff <<
        \clef bass
        <<  \AvoiceDA >>
      >>
>>



      \set Score.skipBars = ##t
      %%\set Score.melismaBusyProperties = #'()
      \override Score.BarNumber #'break-visibility = #end-of-line-invisible %%every bar is numbered.!!!
      %% remove previous line to get barnumbers only at beginning of system.
       #(set-accidental-style 'modern-cautionary)
      \set Score.markFormatter = #format-mark-box-letters %%boxed rehearsal-marks
       \override Score.TimeSignature #'style = #'() %%makes timesigs always numerical
      %% remove previous line to get cut-time/alla breve or common time 
      \set Score.pedalSustainStyle = #'mixed 
       %% make spanners comprise the note it end on, so that there is no doubt that this note is included.
       \override Score.TrillSpanner #'(bound-details right padding) = #-2
      \override Score.TextSpanner #'(bound-details right padding) = #-1
      %% Lilypond's normal textspanners are too weak:  
      \override Score.TextSpanner #'dash-period = #1
      \override Score.TextSpanner #'dash-fraction = #0.5
      %% lilypond chordname font, like mscore jazzfont, is both far too big and extremely ugly (olagunde@start.no):
      \override Score.ChordName #'font-family = #'roman 
      \override Score.ChordName #'font-size =#0 
      %% In my experience the normal thing in printed scores is maj7 and not the triangle. (olagunde):
      \set Score.majorSevenSymbol = \markup {maj7}
  >>

  %% Boosey and Hawkes, and Peters, have barlines spanning all staff-groups in a score,
  %% Eulenburg and Philharmonia, like Lilypond, have no barlines between staffgroups.
  %% If you want the Eulenburg/Lilypond style, comment out the following line:
  \layout {\context {\Score \consists Span_bar_engraver}}
}%% end of score-block 

#(set-global-staff-size 14)
