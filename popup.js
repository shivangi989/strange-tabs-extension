document.addEventListener('DOMContentLoaded',async ()=>{
    console.log("Strange Tabs popup script Loaded");
    try{
    const tab=await chrome.tabs.query({currentWindow:true,pinned:false});
    console.log(tab);
    const saveSessionBtn=document.querySelector('#saveBtn');
    saveSessionBtn.addEventListener('click',async ()=>{
        const sessionName=window.prompt('enter the name of the session');
        if(!sessionName){
            return;
        }
        else{
            const session={
                id:Date.now(),
                title:sessionName,
                update:new Date().toLocaleDateString(),
                tabs:tab
            }
            savesession(session);
        }
    });
    }
    catch(error){
        console.log("Problem fetching the data",error);
    }

});

async function getAllSession(){
    try{
        const sessions=await chrome.storage.local.get(null);
        console.log("Data fetching successfull");
        return sessions;
    }
    catch(error){
        console.log("Error occured while getting the data",error);
    }
}

async function savesession(session){
    try{
        const result=await getAllSession();
        const allSession=result.savedsession||[];
        if(session){
            allSession.push(session);
            await chrome.storage.local.set({savedsession:allSession});
            console.log("your session was saved successfully",allSession);
            alert("Session saved successfully");
        }
        }
    catch(error){
        console.log("Error occured while saving the session",error);
        alert("Error",error);
    }
}
