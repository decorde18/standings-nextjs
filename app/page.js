// app/page.js

import AnimatedTitle from '@/components/ui/AnimatedTitle';

import LeagueStandings from './homePageComponents/LeagueStandings';

export default function Home() {
  return (
    <>
      <AnimatedTitle text="STANDINGS APP" />
      <LeagueStandings />
    </>
  );
}
