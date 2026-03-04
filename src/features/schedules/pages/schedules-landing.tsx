import { APP_CONFIG } from '@/core/configs';
import { lang } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { ScheduleLandingContent } from '../containers';

export const ScheduleLanding = () => {
    return (
        <DashboardPageLayout
            siteTitle={`${lang.text('scheduleMapel')} | ${APP_CONFIG.appName}`}
            breadcrumbs={[
                {
                    label: lang.text('scheduleMapel'),
                    url: '/schedules',
                },
            ]}
            title={lang.text('scheduleMapel')}
        >
            <ScheduleLandingContent />
            <div className="pb-16 sm:pb-0" />
        </DashboardPageLayout>
    );
};