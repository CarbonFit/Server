// do a fetch request to ../metadata
fetch('./metadata').then(res => res.json()).then(data => {
  // hidrate the page with the data
  document.title = data.title;
  document.getElementById('thumbSubTitleSection').style.backgroundImage = `url('./thumb')`;
  document.getElementById('articleThumb').src = data.thumb.split('.')[0];
  document.getElementById('articleSubTitle').innerText = data.subTitle;
  
  var parsedDate = new Date(data.timestamp).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Sao_Paulo'
  }); 
  
  // convert parsed date Hours from 0 to 12
  var beforeHours = parsedDate.split(':')[0].split(' ').slice(0, -1).join(' ');
  var afterHours = parsedDate.split(':')[1];
  var hours = Number(parsedDate.split(':')[0].split(' ').slice(-1));
  if (hours === 0) {
    hours = 12;
  }

  document.getElementById('launchDate').innerText = `Publicado: ${beforeHours} ${hours}:${afterHours}`;
}).catch(err => {
  console.log(err);
});

const content = document.getElementById('content');

content.addEventListener('scroll', () => {
  var viewedAmount = Math.floor(content.scrollTop / (content.scrollHeight - content.clientHeight) * 100);
  document.getElementById('viewedAmountSliderThumb').style.width = `${viewedAmount}%`;
});