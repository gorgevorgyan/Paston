# Paston

<h2>Մաստ</h2>

  <h3>  A-Ղառ</h3>
  <h3>  B-Խաչ</h3>
  <h3>  C-Քյափ</h3>
  <h3>  D-Սիրտ</h3>

<h2>Խաղաքարտեր</h2>

  <h3>1-7</h3>
  <h3>7-A</h3>


<h3>Card Logic</h3>

<pre>
cardList = [...]

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

<h3>Game Logic</h3>

<pre>

  whoStarts({id:[card], id1:[card], id1:[card]}): return some_ID
  
  canSay(whatWant, currTurn=None): retur bool
  
  checkWin({id:card, id1:card, id2:card}): return Id
  
  score(talk, talker, )

</pre>
