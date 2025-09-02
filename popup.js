document.addEventListener('DOMContentLoaded',async ()=>{
    console.log("Strange Tabs popup script Loaded");
    const tab=await getcurrenttabs();
    displayCurrent(tab);
    const saveSessionBtn=document.querySelector('#saveBtn');
    saveSessionBtn.addEventListener('click',async ()=>{
        const tabstosave=await getcurrenttabs();
        const sessionName=window.prompt('enter the name of the session');
        if(!sessionName){
            return;
        }
        else{
            const session={
                id:Date.now(),
                title:sessionName,
                update:new Date().toLocaleDateString(),
                tabs:tabstosave
            }
            savesession(session);
        }
    });
});

async function getcurrenttabs(){
    try{
        const tab=await chrome.tabs.query({currentWindow:true,pinned:false});
        console.log(tab);
        return tab;
    }catch(e){
        console.log("Problem fetching the data",error);
    }
}

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

function displayCurrent(tabs){
    const currentList=document.querySelector(".currentTabList");
    currentList.innerHTML="";
    for (const element of tabs)  {
        const currentdiv=document.createElement('div');
        currentdiv.classList.add('tab-item');
        const icon=document.createElement('img');
        icon.classList.add("icon");
        icon.src=element.favIconUrl;
        const tabtitle=document.createElement('span');
        tabtitle.textContent=element.title;
        currentdiv.appendChild(icon);
        currentdiv.appendChild(tabtitle);
        currentList.appendChild(currentdiv);
    }; 
}

