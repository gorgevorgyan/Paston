# Paston

<h2>Մաստ</h2>

  <h3>  A-Ղառ</h3>
  <h3>  B-Խաչ</h3>
  <h3>  C-Քյափ</h3>
  <h3>  D-Սիրտ</h3>

<h2>Խաղաքարտեր</h2>

  <h3>1-7</h3>
  <h3>7-A</h3>
  
<h2><p style="color: "blue"">class</p> Game:</h2>
    <h3>PlayerList: new Player []</h3>
    <h3>Mast: 'a'||'b'||'c'</h3>
    <h3>Methods:</h3>    
        <h3>getPrice(index) : <p> return PlayerList[index].price || PlayerList.map( player => player.price ) </p></h3> 
        <h3></h3>


<h4>cardList = [...]</h4>
<pre>

for i in ['a', 'b', 'c', 'd']:
  for j in range(7):
    cardList.append(str(i) + str(j))
    
random.shuffle(cardList)

while "a5" in cardList[29:31]: random.shuffle(cardList)

pl1 = cardList[:9]
pl2 = cardList[9:19]
pl3 = cardList[19:29]
pass = cardList[29:31]
</pre>

