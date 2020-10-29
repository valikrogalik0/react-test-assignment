import React, { useEffect, useState } from 'react';

import NewsItem from '../components/NewsItem';

import { IStoryRecord } from '../types/RecordsStructure';
import './App.css';

const App: React.FC = () => {
  const [stories, setStories] = useState<Array<IStoryRecord>>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchData = () => fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then((res) => res.json())
    .then((res) => {
      const sortedRecords = res
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
      return sortedRecords;
    })
    .catch(() => setErrorMessage('Unable to load record data, please try again later'));

  const fetchStoryInfo = (storiesId: Array<number>) => Promise.all(
    storiesId.map((storyId: number) => fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
      .then((res) => res.json())
      .then((story: Array<IStoryRecord>) => story)
      .catch(() => setErrorMessage('Unable to load record data, please try again later'))),
  );

  const fetchAuthorInfo = (storyRecords: IStoryRecord[] | any) => Promise.all(
    storyRecords.map((storyItem: IStoryRecord) => fetch(`https://hacker-news.firebaseio.com/v0/user/${storyItem.by}.json`)
      .then((res) => res.json())
      .then((res) => ({ ...storyItem, user: res }))
      .catch(() => setErrorMessage('Unable to load user data,  please try again later'))),
  );

  useEffect(() => {
    setLoading(true);

    fetchData()
      .then((storiesId) => fetchStoryInfo(storiesId))
      .then((storyRecords) => fetchAuthorInfo(storyRecords))
      .then((res: Array<IStoryRecord> | any) => {
        const sortedList = res.sort(
          (a: IStoryRecord, b: IStoryRecord) => (a.score < b.score ? -1 : 1),
        );

        setStories(sortedList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="App">
      {!!errorMessage && <p className="notification bgRed">{errorMessage}</p>}
      {!!isLoading && !errorMessage && <p className="notification bgGreen">Loading...</p>}

      {!errorMessage && stories.map((story: IStoryRecord) => (
        <NewsItem
          key={story.id}
          isLoading={isLoading}
          story={story}
        />
      ))}
    </div>
  );
};

export default App;
