import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice"
import { useCallback, useEffect, useState } from "react";

interface IState {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string;
  partialResults: string;
  isRecording: string;
}

export const useVoiceRecognition = () => {
  const [state, setState] = useState<IState>({
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],
    isRecording: false,
  })
  const resetState = useCallback(() => {
    setState({
      recognized: "",
      pitch: "",
      error: "",
      end: "",
      started: "",
      results: [],
      partialResults: [],
      isRecording: false,
    })
  }, [setState]);

  const startRecognizing = useCallback(async() => {
    resetState();
    try{
      await Voice.start("en-US");
    } catch (e){
      console.log(e)
    }
  }, [resetState]);

  const stopRecognizing = useCallback(async() => {
    resetState();
    try{
      await Voice.stop();
    } catch (e){
      console.log(e)
    }
  }, [resetState]);
  
  const cancelRecognizing = useCallback(async() => {
    resetState();
    try{
      await Voice.cancel();
    } catch (e){
      console.log(e)
    }
  }, [resetState]);

  const destroyRecognizing = useCallback(async() => {
    resetState();
    try{
      await Voice.destroy();
    } catch (e){
      console.log(e)
    }
  }, [resetState]);

  useEffect(() => {
    Voice.onSpeechStart =(e: any) => {
      setState((prevState) => ({
      ...prevState,
      started "yes",
      isRecording: true
    }));
  };

  Voice.onSpeechRecognized = () => {
    setState((prevState) => ({ ..prevState, recognized: "yes"}));
  }
  Voice.onSpeechEnd = (e: any) => {
    setState((prevState) => ({ 
      ...prevState, 
      end: "yes",
      isRecording: false
    }));
  }

  Voice.onSpeechError = (e: SpeechErrorEvent) => {
    setState((prevState) => ({ 
      ...prevState, 
      error: JSON.stringify(e.error),
      isRecording: false
    }));
  }

  Voice.onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value) {
      setState((prevState) => ({
        ...prevState,results: e.value!
      }))
    }
  }

  Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
    if (e.value) {
      setState((prevState) => ({
        ...prevState,results: e.value!
      }))
    }
  }

  Voice.onSpeechVolumeChanged = (e: any) => {
    setState((prevstate) => ({
      ...prevstate, partialResults: e.value!
    }))
  }

  return () => {
    Voice.destroy().then(Voice.removeAllListeners);
  }

}, [])

  return{
    state,
    setState,
    resetState,
    startRecognizing,
    stopRecognizing,
    cancelRecognizing,
    destroyRecognizing
  }

}