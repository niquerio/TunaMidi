<?php
    $midi = $_POST["midi_src"];
    
    if( !preg_match('/^https?:\/\//i',$midi) ){
        header('HTTP/1.1 500 Internal Server Error');
        die('Not http or https');
    }
    $output = file_get_contents($midi, NULL, NULL, NULL, 300000);
    if(strlen($output) == 300000){
       header('HTTP/1.1 500 Internal Server Error');
       print('File Too Big');
    } elseif(substr($output, 0, 4) != "MThd"){ 
	    header('HTTP/1.1 500 Internal Server Error');
	    print('Not Valid MIDI Header');
    }else{
       echo 'data:audio/midi;base64,' .  base64_encode($output);
    }

?>
