//create context api
//provider
//usecontexthook(previously comsumer is used hwich is very lengthy)
import React, { useContext, useEffect, useReducer } from "react";
import reducer from "./reducer";

const APISUB="https://openlibrary.org/subjects/";
const APITITLE_AUTH="https://openlibrary.org/search.json?";
let Url="";
let offset=0;
let max_offest=20;
var sub_or_title=false;

const initialData={
    isLoading:false,
    querySubject: "",
    queryTitleAuthor:"",
    page_no:1,
    data:[], 
    objdata:{},    
}
const AppContext=React.createContext();

/////////////////////////////////////////////////////////////////////////////////////////////
//.......................................................................................

//createing provider function
const AppProvider=({children})=>{

const [state,dispatch]=useReducer(reducer,initialData);  // reduceer is function(action Method) it is the only extra differece from useState hook

//........................................................................
    const searchsubjectQuery=async (e)=>{        
        if(e.keyCode===13)
         {  
            sub_or_title=false;
            offset=0;
            dispatch({type:"SEARCH_SUBJECT",
                     payload:e.target.value})
         }
           
    }
//........................................................................
        const searchbyTitle=(e)=>{
            
            if(e.keyCode===13) 
                {  offset=0;
                    sub_or_title=true;
                    let txt=e.target.value.split(' ');
                    let count=1;
                    let text="";
                    txt.map((item)=>{
                            if(count)
                            {
                                text=item;
                                count=0;
                            }
                            else text=text + "+" + item;
                    })     
                    dispatch({type:"SEARCH_BY_TITLE_AUTHOR",
                                payload:text
                            })
            }
    }
//........................................................................
useEffect(()=>{
        const fetchSubjects= async(URL1)=>{
            Url=URL1;
            const URL=`${URL1}${offset}`
            console.log(URL);
            dispatch({type:"SET_LOADING"});
            try{               
                   const res=await fetch(URL);
                   
                    const resjson=await res.json(); 
                    max_offest=resjson.work_count;                  
                     dispatch({
                        type:"FETCH_DATA",
                        payload:resjson.works,                
                        });
                      
        }catch(error){
            console.log(error);
        }};
        
      if(state.querySubject!="")
        fetchSubjects(`${APISUB}${state.querySubject}.json?ebooks=true&limit=10&offset=`)
       
    },[state.querySubject])
//..............................................................................
    useEffect(()=>{

        const fetchTitleAuthor=async(URL2)=>{
            Url=URL2;
            const URL=`${URL2}${offset}`
            dispatch({type:"SET_LOADING"})
            try{
                    const res=await fetch(URL);
                    const resjson=await res.json();
                    max_offest=resjson.num_found;
                    dispatch({type:"FETCH_DATA",
                                payload:resjson.docs    
            });            
            }catch(error){
                console.log(error);
            }
        }
        if(state.queryTitleAuthor!="")
            fetchTitleAuthor(`${APITITLE_AUTH}q=${state.queryTitleAuthor}&limit=10&offset=`);
    },[state.queryTitleAuthor])
    //.................................................
    

    const changeoffsett= async()=>{
            const Urlof=`${Url}${offset}`;            
                       
            dispatch({type:"SET_LOADING"});
            try{               
                   const res=await fetch(Urlof);
                    const resjson=await res.json();
                  
                    if(Url[25]==='e')
                            {
                                dispatch({type:"FETCH_DATA",
                                payload:resjson.docs    
                                        });
                            }
                            else{
                                dispatch({
                                    type:"FETCH_DATA",
                                     payload:resjson.works,                
                                    });  
                            }         
        }catch(error){
            console.log(error);
        }}        
 //................................................................

const changeoffsetP=()=>{
    offset=offset-10; 
    if(offset>=0)
            changeoffsett();    
}
const changeoffsetN=()=>{
    offset= offset +10;
    if(offset<max_offest)
        changeoffsett();    
}
//////////////////////////////////////////////////////////////////////////////////////

    return (
            <AppContext.Provider value={{...state,searchsubjectQuery,searchbyTitle,changeoffsetN,changeoffsetP,sub_or_title}}>
                {children}
            </AppContext.Provider>);
};
//////////////////////////////////////////////////////////////////////////////////////

//use before functyion name is must for custome hook
const useGlobalContext=()=>         //custome hook ao that we can export both AppContext and AppProviser in one hook
{
    return useContext(AppContext);
}
export {AppContext,AppProvider,useGlobalContext};
